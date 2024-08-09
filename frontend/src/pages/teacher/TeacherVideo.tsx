import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import OpenViduVideoComponent from "../../components/openvidu/VideoComponent";
import {
  handleSpeechRecognition,
  // stopRecording,
  // startSegmentRecording,
  stopSegmentRecording,
  startMainRecording, // 메인 녹화 관련 함수 추가
  stopMainRecording, // 메인 녹화 관련 함수 추가
} from "../../api/openvidu";
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
  // const location = useLocation();
  // const { parentName } = location.state || {};
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
  // const [tabOpen, setTabOpen] = useState<TabState>({
  //   formTab: false,
  //   profileTab: false,
  //   chatTab: false,
  // });
  const [control, setControl] = useState<ControlState>({
    video: false,
    mic: false,
    muted: false,
    volume: 0.2,
  });
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isSessionJoined, setIsSessionJoined] = useState(false);

  const [myStreamId, setMyStreamId] = useState<string | undefined>(undefined);
  const [otherVideoActive, setOtherVideoActive] = useState(false);
  const [otherOpacity, setOtherOpacity] = useState(false);

  const segmentList = useRef<string[]>([]);
  const intervalIdRef = useRef<number | null>(null);

  const [isRecording, setIsRecording] = useState(false); // 녹화 상태 관리
  const [currentRecordingId, setCurrentRecordingId] = useState<string | null>(null);

  useEffect(() => {
    console.log("useEffect - otherVideoActive changed", otherVideoActive);
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
      console.log("Fetching teacher info...");
      try {
        const fetchedTeacherInfo = await getTeacherInfo();
        console.log("Fetched teacher info:", fetchedTeacherInfo);
        setTeacherInfo(fetchedTeacherInfo);
        setUser((prevUser) => ({ ...prevUser, username: fetchedTeacherInfo.name }));
      } catch (error) {
        console.log("Failed to fetch teacher info:", error);
      }
    }

    if (!teacherInfo) {
      fetchTeacherInfo();
    } else {
      console.log("Teacher info already available", teacherInfo);
      setUser((prevUser) => ({ ...prevUser, username: teacherInfo.name }));
    }
  }, [teacherInfo, setTeacherInfo]);

  useEffect(() => {
    console.log("Fetching recordings...");
    fetchRecordingsList(setRecordings);
  }, []);

  useEffect(() => {
    if (openvidu.publisher) {
      console.log("Publishing audio:", control.mic);
      openvidu.publisher.publishAudio(control.mic);
      console.log("Publishing video:", control.video);
      openvidu.publisher.publishVideo(control.video);
    }
  }, [control, openvidu.publisher]);

  useEffect(() => {
    if (isSessionJoined && !isRecording) {
      handleSpeechRecognition(
        user.sessionId,
        setCurrentRecordingId,
        segmentList,
        intervalIdRef,
        handleStartMainRecording
      );
    }
  }, [isSessionJoined, isRecording]);

  const handleStartMainRecording = async () => {
    if (isRecording) return;
  
    setIsRecording(true);
    clearInterval(intervalIdRef.current); // 세그먼트 녹화 타이머 중지
  
    // 세그먼트 녹화 중지 및 병합
    await stopSegmentRecording(segmentList.current[segmentList.current.length - 1]);
    segmentList.current = []; // 세그먼트 리스트 초기화
  
    // 메인 녹화를 시작하는 로직
    console.log("Starting main recording...");
    const mainRecordingId = await startMainRecording(user.sessionId);
    console.log("Main recording ID:", mainRecordingId);
    setCurrentRecordingId(mainRecordingId);
  
    // 상태 업데이트 후 값을 확인
    console.log("Updated currentRecordingId:", mainRecordingId);
  };

  const handleStopRecording = async () => {
    if (!isRecording) return;

    setIsRecording(false);
    console.log(currentRecordingId)
    // 메인 녹화를 중지하는 로직
    await stopMainRecording(currentRecordingId);

    // 녹화 중지 후 다시 세그먼트 녹화 시작
    handleSpeechRecognition(
      user.sessionId,
      setCurrentRecordingId,
      segmentList,
      intervalIdRef,
      handleStartMainRecording
    );
  };

  const handleLeaveSession = () => {
    console.log("Leaving session...");
    if (isRecording) {
      handleStopRecording(); // 세션 종료 시 녹화 중지
    }
    leaveSession(openvidu, setOpenvidu, setIsSessionJoined, navigate);
  };

  const teacherVideoOpacity = control.video ? 1 : 0.8;

  return (
    <div className="relative flex flex-col justify-center items-center w-screen h-screen min-w-[1000px] overflow-hidden">
      <img src={MeetingBackground} className="absolute top-0 left-0 w-full h-full object-cover" />
      <div className="relative z-10 w-full h-full flex flex-col items-center">
        <TeacherHeader />
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
            startRecording={handleStartMainRecording} // 녹화 시작 함수 전달
            stopRecording={handleStopRecording} // 녹화 중지 함수 전달
            isRecording={isRecording} // 녹화 상태 전달
          />
        )}
      </div>
    </div>
  );
}
