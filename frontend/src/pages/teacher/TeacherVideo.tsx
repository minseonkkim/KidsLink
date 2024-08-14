import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OpenViduVideoComponent from "../../components/openvidu/VideoComponent";
import { startMainRecording, stopMainRecording } from "../../api/openvidu";
import MeetingBackground from "../../assets/teacher/meeting_background.png";
import { useTeacherInfoStore } from "../../stores/useTeacherInfoStore";
import { getTeacherInfo } from "../../api/Info";
import TeacherMeetingFooter from "../../components/openvidu/TeacherMeetingFooter";
import { ControlState, OpenViduState, User } from "../../types/openvidu";
import { joinSession, leaveSession } from "../../utils/openvidu";
import DefaultProfile from "../../assets/teacher/default_profile.png";
import { getMeetingInfo } from "../../api/meeting";
import { FaBan } from "react-icons/fa";
import { IoDocumentAttach, IoRecording } from "react-icons/io5";
import { GiTalk } from "react-icons/gi";
import { TbMoodKidFilled } from "react-icons/tb";
import parentImg from "../../assets/parent/cute-daramgi.png";

export default function TeacherVideo() {
  const [meetingDate, setMeetingDate] = useState(""); // 상담 날짜 상태 추가
  const [meetingTime, setMeetingTime] = useState(""); // 상담 시간 상태 추가
  const [meetingEndTime, setMeetingEndTime] = useState(""); // 상담 종료 시간 상태 추가
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
        // 상담 날짜 설정 (이거 utils에 저장된 날짜 함수 확인해보고 쓸지말지 수정하기)
        const date = new Date(meetingInfo.date);
        setMeetingDate(`${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`);

        // 상담 시간 설정
        setMeetingTime(meetingInfo.time);

        // 상담 종료 시간 계산
        const [hours, minutes] = meetingInfo.time.split(":").map(Number);
        const endDate = new Date(date);
        endDate.setHours(hours);
        endDate.setMinutes(minutes + 30); // 상담 시간은 30분
        const endHours = endDate.getHours().toString().padStart(2, "0");
        const endMinutes = endDate.getMinutes().toString().padStart(2, "0");
        setMeetingEndTime(`${endHours}:${endMinutes}`);
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
      } catch (error) {
        console.error("Failed to stop recording before leaving session:", error);
      }
    }
    sendSignalLeaveSession("session-ended");
    setTimeout(() => {
      leaveSession(openvidu, setOpenvidu, setIsSessionJoined, navigate);
    }, 1000);
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

  const handleOutClick = () => {
    leaveSession(openvidu, setOpenvidu, setIsSessionJoined, navigate);
    navigate("/meeting");
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
            <div className="absolute top-[150px] right-[600px] font-bold text-[20px] flex flex-row items-center">
              <img
                src={parentImg}
                className="w-[40px] h-[40px] rounded-full object-cover mr-3"
              />
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
            <div className="absolute top-[250px] bg-[#fff9d7] rounded-[20px] p-6 shadow-lg border-2 border-[#ffec8a] bg-notebook-pattern">
            {/* 상담 안내문 */}
            <p className="text-base font-bold text-[#212121] mb-4">
              {meetingDate} {meetingTime} ~ {meetingEndTime}
            </p>
            <div className="text-sm text-[#212121] mb-6">
              <p className="font-bold mb-2 text-xl">상담 중 지켜야 할 규칙</p>
              <ul className="list-none space-y-2">
                <li className="flex items-center">
                  <div className="flex items-center justify-center mr-2">
                    <IoDocumentAttach className="text-[#ff6347]" size={20} />
                  </div>
                  <span className="flex-1 text-lg">상담에 필요한 자료들은 미리 준비해주세요.</span>
                </li>
                <li className="flex items-center">
                  <div className="flex items-center justify-center mr-2">
                    <GiTalk className="text-[#ff6347]" size={20} />
                  </div>
                  <span className="flex-1 text-lg">학부모가 편안하게 자신의 생각을 표현할 수 있도록 도와주세요.</span>
                </li>
                <li className="flex items-center">
                  <div className="flex items-center justify-center mr-2">
                    <TbMoodKidFilled className="text-[#ff6347]" size={20} />
                  </div>
                  <span className="flex-1 text-lg">학생의 긍정적인 면을 강조해주세요.</span>
                </li>
                <li className="flex items-center">
                  <div className="flex items-center justify-center mr-2">
                    <IoRecording className="text-[#ff6347]" size={20} />
                  </div>
                  <span className="flex-1 text-lg">학부모가 욕설을 할 경우 자동으로 녹화가 진행됩니다.</span>
                </li>
              </ul>
            </div>
            <div className="flex justify-center gap-4">
              {/* 세션 연결 버튼 */}
              <button
                onClick={() =>
                  joinSession(
                    user,
                    setOpenvidu,
                    setIsSessionJoined,
                    setMyStreamId,
                    setOtherVideoActive // 추가
                  )
                }
                className="w-28 h-10 bg-[#ffec8a] rounded-full flex items-center justify-center text-lg font-medium text-[#212121] hover:bg-[#fdda6e] transition-colors"
              >
                입장하기
              </button>
              <button onClick={handleOutClick} className="w-28 h-10 bg-[#ffec8a] rounded-full flex items-center justify-center text-lg font-medium text-[#212121] hover:bg-[#fdda6e] transition-colors">
                나가기
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
