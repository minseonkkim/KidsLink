import { useLocation, useParams, useNavigate } from "react-router-dom";
import { ChangeEvent, useEffect, useState } from "react";
import OpenViduVideoComponent from "../../components/openvidu/VideoComponent";
import { handleSpeechRecognition, stopRecording } from "../../api/openvidu";
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

  useEffect(() => {
    if (isSessionJoined) {
      handleSpeechRecognition(user.sessionId, setCurrentRecordingId);
    }
  }, [isSessionJoined, user.sessionId]);

  const handleUserChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUser((prevUser) => ({ ...prevUser, [event.target.name]: event.target.value }));
  };

  const handleStopRecording = async () => {
    if (currentRecordingId) {
      try {
        const stoppedRecording = await stopRecording(currentRecordingId);
        setCurrentRecordingId(null);
        fetchRecordingsList(setRecordings);
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    }
  };

  const handleLeaveSession = () => {
    leaveSession(openvidu, setOpenvidu, setIsSessionJoined, navigate);
  };

  // 상대방 비디오 상태에 따라 불투명도 설정a
  const teacherVideoOpacity = control.video ? 1 : 0.8;
  // const parentVideoOpacity = otherVideoActive ? 1 : 0.8;

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
          <div className="flex flex-col justify-center items-center w-full h-full">
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
            stopRecording={handleStopRecording}
            isRecording={!!currentRecordingId}
          />
        )}
        {/* 
        해당 위치 제외하고, 녹화 목록 컴포넌트 따로 제외하기
        {!openvidu.session && (
          <div className="recordings-list mt-4">
            <h2>녹화 파일 목록</h2>
            <ul>
              {recordings.map((recording) => (
                <li key={recording.id}>
                  {recording.name} -{" "}
                  <button onClick={() => handleDownload(user.sessionId, recording.name)}>
                    Download Recording
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )} */}
      </div>
    </div>
  );
}
