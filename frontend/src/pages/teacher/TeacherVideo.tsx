import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OpenViduVideoComponent from "../../components/openvidu/VideoComponent";
import { handleSpeechRecognition, startMainRecording, stopMainRecording } from "../../api/openvidu";
import MeetingBackground from "../../assets/teacher/meeting_background.png";
import { useTeacherInfoStore } from "../../stores/useTeacherInfoStore";
import { getTeacherInfo } from "../../api/Info";
import TeacherMeetingFooter from "../../components/openvidu/TeacherMeetingFooter";
import { ControlState, OpenViduState, User } from "../../types/openvidu";
import { joinSession, leaveSession } from "../../utils/openvidu";
import DefaultProfile from "../../assets/teacher/default_profile.png";
import { getMeetingInfo } from "../../api/meeting";

export default function TeacherVideo() {
  const navigate = useNavigate();
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
  const [control, setControl] = useState<ControlState>({
    video: false,
    mic: false,
    muted: false,
    volume: 0.4,
  });
  const [myStreamId, setMyStreamId] = useState<string | undefined>(undefined);
  const [otherVideoActive, setOtherVideoActive] = useState(false);
  const [otherOpacity, setOtherOpacity] = useState(false);
  const [isSessionJoined, setIsSessionJoined] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentRecordingId, setCurrentRecordingId] = useState<string | null>(null);
  const [recordStartTime, setRecordStartTime] = useState<number | null>(null);
  const recordingStartTimeRef = useRef<number | null>(null);
  const [childName, setChildName] = useState<string>(""); // childName 상태 추가
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    async function fetchChildInfo() {
      console.log("자녀 정보 패치 중...");
      try {
        const meetingInfo = await getMeetingInfo(Number(meetingId));
        setChildName(meetingInfo.childName); // childName 상태 설정
      } catch (error) {
        console.error("자녀 정보를 가져오지 못했습니다:", error);
      }
    }

    if (meetingId) {
      fetchChildInfo();
    }
  }, [meetingId]);

  useEffect(() => {
    if (openvidu.session) {
      openvidu.session.on("signal:profanityDetected", (event) => {
        console.log("학부모 욕설 감지:", event);

        if (recordingStartTimeRef.current) {
          const detectedTime = Date.now();
          const adjustedStartTime = Math.max(recordingStartTimeRef.current, detectedTime - 20000);
          setRecordStartTime(adjustedStartTime);
          console.log("Adjusted recording start time:", adjustedStartTime);
        }
      });
    }
  }, [openvidu.session]);

  useEffect(() => {
    async function fetchTeacherInfo() {
      try {
        const fetchedTeacherInfo = await getTeacherInfo();
        setTeacherInfo(fetchedTeacherInfo);
        setUser((prevUser) => ({ ...prevUser, username: fetchedTeacherInfo.name }));
      } catch (error) {
        console.log("Failed to fetch teacher info:", error);
      }
    }

    if (!teacherInfo) {
      fetchTeacherInfo();
    } else {
      setUser((prevUser) => ({ ...prevUser, username: teacherInfo.name }));
    }
  }, [teacherInfo, setTeacherInfo]);

  useEffect(() => {
    if (openvidu.publisher) {
      openvidu.publisher.publishAudio(control.mic);
      openvidu.publisher.publishVideo(control.video);
    }
  }, [control, openvidu.publisher]);

  useEffect(() => {
    if (isSessionJoined && !isRecording) {
      handleStartRecording();
    }
  }, [isSessionJoined]);

  const handleStartRecording = async () => {
    try {
      const recordingId = await startMainRecording(user.sessionId);
      setCurrentRecordingId(recordingId);
      setIsRecording(true);
      recordingStartTimeRef.current = Date.now();
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const handleStopRecording = async () => {
    if (!isRecording || !currentRecordingId) return;

    try {
      setIsRecording(false);
      const startTime = recordStartTime - recordingStartTimeRef.current;
      await stopMainRecording(currentRecordingId, startTime);
      setCurrentRecordingId(null);
      recordingStartTimeRef.current = null;
      setRecordStartTime(null);
    } catch (error) {
      console.error("Failed to stop recording:", error);
    }
  };

  const handleLeaveSession = () => {
    setIsModalOpen(true); // 모달을 열기
  };

  const confirmLeaveSession = async () => {
    if (isRecording) {
      try {
        await handleStopRecording();
        // 학부모들에게 세션 종료를 알리는 Signal을 보냄
        sendSignalLeaveSession("session-ended");
      } catch (error) {
        console.error("Failed to stop recording before leaving session:", error);
      }
    }
    leaveSession(openvidu, setOpenvidu, setIsSessionJoined, navigate);
  };

  const sendSignalLeaveSession = (message) => {
    openvidu.session.signal({
      type: "session-ended",
      data: message,
    });
  };

  const cancelLeaveSession = () => {
    setIsModalOpen(false); // 모달을 닫기
  };

  const teacherVideoOpacity = control.video ? 1 : 0.8;

  return (
    <div className="relative flex flex-col justify-center items-center w-screen h-screen min-w-[1000px] overflow-hidden">
      <img src={MeetingBackground} className="absolute top-0 left-0 w-full h-full object-cover" />
      <div className="relative z-10 w-full h-full flex flex-col items-center">
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
            <div className="absolute top-[150px] right-[648px] font-bold text-[20px]">
              {childName} 학부모
            </div>
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
            startRecording={handleStartRecording}
            stopRecording={handleStopRecording}
            isRecording={isRecording}
          />
        )}
      </div>

      {/* 모달 컴포넌트 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">세션을 종료하시겠습니까?</h2>
            <p className="mb-4">학부모와 함께 상담이 종료됩니다.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={confirmLeaveSession}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                종료
              </button>
              <button
                onClick={cancelLeaveSession}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
