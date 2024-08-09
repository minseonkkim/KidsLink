import { useLocation, useParams, useNavigate } from "react-router-dom";
import { ChangeEvent, useEffect, useState, useRef } from "react"; // useRef 추가
import OpenViduVideoComponent from "../../components/openvidu/VideoComponent";
import {
  handleSpeechRecognition,
  stopRecording,
  startSegmentRecording,
  stopSegmentRecording,
} from "../../api/openvidu"; // 필요한 함수들 추가
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import MeetingBackground from "../../assets/teacher/meeting_background.png";
import { useTeacherInfoStore } from "../../stores/useTeacherInfoStore";
import { getTeacherInfo } from "../../api/Info";
import TeacherMeetingFooter from "../../components/openvidu/TeacherMeetingFooter";
import { ControlState, OpenViduState, Recording, TabState, User } from "../../types/openvidu";
import { fetchRecordingsList, joinSession, leaveSession } from "../../utils/openvidu";
import DefaultProfile from "../../assets/teacher/default_profile.png";

export default function TeacherVideo() {
  const navigate = useNavigate();
  const location = useLocation();
  const { parentName } = location.state || {};
  const { meetingId } = useParams<{ meetingId: string }>();
  const { teacherInfo, setTeacherInfo } = useTeacherInfoStore();
  const [user, setUser] = useState<User>({
    sessionId: meetingId,
    username: teacherInfo?.name || "",
    classname: teacherInfo?.kindergartenClassName || "",
    profile: teacherInfo?.profile || DefaultProfile,
  });
  const [openvidu, setOpenvidu] = useState<OpenViduState>({
    session: undefined,
    mainStreamManager: undefined,
    publisher: undefined,
    subscribers: [],
  });
  const [tabOpen, setTabOpen] = useState<TabState>({
    formTab: false,
    profileTab: false,
    chatTab: false,
  });
  const [control, setControl] = useState<ControlState>({
    video: false,
    mic: false,
    muted: false,
    volume: 0.2,
  });
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [currentRecordingId, setCurrentRecordingId] = useState<string | null>(null);
  const [isSessionJoined, setIsSessionJoined] = useState(false);
  const [myStreamId, setMyStreamId] = useState<string | undefined>(undefined);
  const [otherVideoActive, setOtherVideoActive] = useState(false);
  const [otherOpacity, setOtherOpacity] = useState(false);

  const segmentList = useRef<string[]>([]); // 세그먼트 리스트 관리 - Chat GPT 추가
  const intervalIdRef = useRef<number | null>(null); // 인터벌 ID 관리 - Chat GPT 추가

  useEffect(() => {
    if (otherVideoActive) {
      if (otherOpacity) {
        setOtherOpacity(false);
      } else {
        setOtherOpacity(true);
      }
    }
  }, [otherVideoActive]);

  useEffect(() => {
    async function fetchTeacherInfo() {
      try {
        const fetchedTeacherInfo = await getTeacherInfo();
        setTeacherInfo(fetchedTeacherInfo);
        setUser((prevUser) => ({ ...prevUser, username: fetchedTeacherInfo.name }));
      } catch (error) {
        console.error("Failed to fetch teacher info:", error);
      }
    }

    if (!teacherInfo) {
      fetchTeacherInfo();
    } else {
      setUser((prevUser) => ({ ...prevUser, username: teacherInfo.name }));
    }
  }, [teacherInfo, setTeacherInfo]);

  useEffect(() => {
    fetchRecordingsList(setRecordings);
  }, []);

  useEffect(() => {
    if (openvidu.publisher) {
      openvidu.publisher.publishAudio(control.mic);
      openvidu.publisher.publishVideo(control.video);
    }
  }, [control, openvidu.publisher]);

  // 녹화 시작 핸들러 - Chat GPT 추가
  const handleStartRecording = async () => {
    if (user.sessionId) {
      try {
        const recordingId = await startSegmentRecording(user.sessionId);
        setCurrentRecordingId(recordingId);
        segmentList.current.push(recordingId);
        console.log("Recording started with ID:", recordingId);

        intervalIdRef.current = window.setInterval(async () => {
          const lastSegmentId = segmentList.current[segmentList.current.length - 1];
          await stopSegmentRecording(lastSegmentId);

          const newRecordingId = await startSegmentRecording(user.sessionId);
          segmentList.current.push(newRecordingId);
          setCurrentRecordingId(newRecordingId);
        }, 5000);
      } catch (error) {
        console.error("Error starting recording:", error);
      }
    }
  };

  const handleStopRecording = async () => {
    if (currentRecordingId) {
      try {
        // 필요한 파라미터들을 채워서 stopRecording 함수를 호출
        const mergedFilePath = await stopRecording(
          user.sessionId, // sessionId
          segmentList.current, // 세그먼트 리스트
          intervalIdRef // 인터벌 ID 관리
        );
  
        setCurrentRecordingId(null); // 녹화 ID 초기화
        fetchRecordingsList(setRecordings); // 녹화 목록 갱신
        console.log("Recording stopped and merged. File path:", mergedFilePath);
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    }
  };

  const handleLeaveSession = () => {
    leaveSession(openvidu, setOpenvidu, setIsSessionJoined, navigate);
  };

  // 상대방 비디오 상태에 따라 불투명도 설정
  const teacherVideoOpacity = control.video ? 1 : 0.8;

  return (
    <div className="relative flex flex-col justify-center items-center w-screen h-screen min-w-[1000px] overflow-hidden">
      <img src={MeetingBackground} className="absolute top-0 left-0 w-full h-full object-cover" />
      <div className="relative z-10 w-full h-full flex flex-col items-center">
        <TeacherHeader />
        {/* 비디오 영역은 항상 렌더링됨 */}
        <div className="relative w-full h-full flex">
          {openvidu.session && (
            <div className="absolute top-[150px] left-[100px] font-bold text-[20px] flex flex-row items-center">
              <img
                src={user.profile}
                className="w-[40px] h-[40px] rounded-full object-cover mr-3"
              />
              {user.classname} 선생님
            </div>
          )}
          <div
            className="absolute top-[200px] left-[100px] w-[600px] h-auto rounded-lg bg-white"
            style={{ opacity: teacherVideoOpacity, backgroundColor: "white" }}
          >
            {openvidu.mainStreamManager && (
              <OpenViduVideoComponent streamManager={openvidu.mainStreamManager} />
            )}
          </div>
          {openvidu.session && (
            <div className="absolute top-[150px] right-[648px] font-bold text-[20px]">학부모</div>
          )}
          {openvidu.session && (
            <div
              className="absolute top-[200px] right-[100px] w-[600px] h-[340px] rounded-lg bg-white"
              style={{ opacity: 1, backgroundColor: "white" }}
            >
              {openvidu.subscribers.length > 0 && (
                <OpenViduVideoComponent
                  streamManager={openvidu.subscribers[0]}
                  muted={control.muted}
                  volume={control.volume}
                />
              )}
            </div>
          )}
        </div>
        {!openvidu.session && (
          <div className="flex flex-col items-center w-full h-full">
            <div className="bg-white p-5 rounded-xl drop-shadow-md bg-[#]">
              <p>상담번호 : {user.sessionId}</p>
              <p>참가자 : {user.username}</p>
              <p>
                학부모가 욕설을 할 경우 자동으로 녹화가 진행됩니다. <br /> 녹화중지를 원하실 경우,
                "녹화중지" 버튼을 눌러주세요.
              </p>
              <div className="flex justify-center mt-2">
                <button
                  onClick={() =>
                    joinSession(
                      user,
                      setOpenvidu,
                      setIsSessionJoined,
                      setMyStreamId,
                      setOtherVideoActive
                    )
                  }
                  className="w-[70px] h-[38px] border-[2px] border-[#7C7C7C] bg-[#E3EEFF] px-3 py-1 font-bold rounded-[8px] hover:bg-[#D4DDEA]"
                >
                  연결
                </button>
              </div>
            </div>
          </div>
        )}
        {isSessionJoined && (
          <TeacherMeetingFooter
            control={control}
            handleControl={setControl}
            close={handleLeaveSession}
            startRecording={handleStartRecording} // 녹화 시작 핸들러 전달 - Chat GPT 추가
            stopRecording={handleStopRecording}
            isRecording={!!currentRecordingId}
          />
        )}
      </div>
    </div>
  );
}
