import { useState, useEffect } from "react"
import Draggable from "react-draggable"
import bgImg from "../../assets/parent/meeting_bg.png"
import OpenViduVideoComponent from "../../components/openvidu/VideoComponent"
import ParentMeetingFooter from "../../components/openvidu/ParentMeetingFooter"
import { useParams, useNavigate } from "react-router-dom"
import { useParentInfoStore } from "../../stores/useParentInfoStore"
import { ControlState, OpenViduState, User } from "../../types/openvidu"
import {
  fetchParentInfo,
  joinSession,
  leaveSession,
} from "../../utils/openvidu"
import { getMeetingInfo } from "../../api/meeting"
import { FaHandsHelping, FaUserSecret, FaBan } from 'react-icons/fa'

export default function ParentVideo() {
  const navigate = useNavigate();
  const { meetingId } = useParams<{ meetingId: string }>();
  const [myStreamId, setMyStreamId] = useState<string | undefined>(undefined);
  const { parentInfo, setParentInfo } = useParentInfoStore();
  const [user, setUser] = useState<User>({
    sessionId: meetingId,
    username: parentInfo?.child?.name || "",
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
    volume: 0.2,
  });
  const [isSessionJoined, setIsSessionJoined] = useState(false);
  const [teacherName, setTeacherName] = useState("");
  const [meetingDate, setMeetingDate] = useState(""); // 상담 날짜 상태 추가
  const [meetingTime, setMeetingTime] = useState(""); // 상담 시간 상태 추가
  const [meetingEndTime, setMeetingEndTime] = useState(""); // 상담 종료 시간 상태 추가
  const [otherVideoActive, setOtherVideoActive] = useState(false);

  // 선생님 이름 및 상담 날짜, 시간 가져오기
  useEffect(() => {
    const fetchMeetingInfo = async () => {
      try {
        const res = await getMeetingInfo(parseInt(meetingId));
        setTeacherName(res.teacherName);

        // 상담 날짜 설정 (이거 utils에 저장된 날짜 함수 확인해보고 쓸지말지 수정하기)
        const date = new Date(res.date);
        setMeetingDate(
          `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
        );

        // 상담 시간 설정
        setMeetingTime(res.time);

        // 상담 종료 시간 계산
        const [hours, minutes] = res.time.split(":").map(Number);
        const endDate = new Date(date);
        endDate.setHours(hours);
        endDate.setMinutes(minutes + 30); // 상담 시간은 30분
        const endHours = endDate.getHours().toString().padStart(2, "0");
        const endMinutes = endDate.getMinutes().toString().padStart(2, "0");
        setMeetingEndTime(`${endHours}:${endMinutes}`);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMeetingInfo();
  }, [meetingId]);

  useEffect(() => {
    if (!parentInfo) {
      fetchParentInfo(setParentInfo, setUser);
    } else {
      setUser((prevUser) => ({ ...prevUser, username: parentInfo.child.name }));
    }
  }, [parentInfo, setParentInfo]);

  // control 상태가 변경될 때마다 publisher의 오디오와 비디오 상태를 업데이트
  useEffect(() => {
    if (openvidu.publisher) {
      openvidu.publisher.publishAudio(control.mic);
      openvidu.publisher.publishVideo(control.video);
    }
  }, [control, openvidu.publisher]);

  const parentVideoOpacity = control.video ? 1 : 0.8; // 부모 비디오의 투명도
  const teacherVideoOpacity = otherVideoActive ? 1 : 0.6; // 상대방 비디오의 투명도

  // 나가기 버튼 클릭
  const handleOutClick = () => {
    navigate("/meeting");
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat px-4 pt-4 flex items-center justify-center"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      {/* 반투명 검정 배경 */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      {openvidu.session ? (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <Draggable>
          {/* 수정 필요한 부분 */}
            <div
              className="absolute top-4 right-4 w-[120px] h-[150px] rounded-lg border border-white z-50 bg-black cursor-move flex items-center justify-center"
              style={{ opacity: parentVideoOpacity, backgroundColor: "white" }}
            >
              {/* 부모 비디오가 꺼져있을 때 표시 */}
              {!control.video && (
                <div className="absolute z-50 text-white text-opacity-100">
                  학부모
                </div>
              )}
              <div className="h-full w-full flex items-center justify-center">
                {openvidu.mainStreamManager && (
                  <OpenViduVideoComponent
                    streamManager={openvidu.mainStreamManager}
                  />
                )}
              </div>
            </div>
          </Draggable>
          {/* 수정 필요한 부분 */}
          <div
            className="absolute top-20 bg-white w-[90%] h-[calc(70vh)] rounded-lg z-40 flex items-center justify-center"
            style={{ opacity: teacherVideoOpacity, backgroundColor: "white" }}
          >
            {/* 상대방 비디오가 꺼져있을 때 표시 */}
            {!otherVideoActive && (
              <div className="absolute z-50 text-white text-opacity-100">
                교사
              </div>
            )}
            {/* 구독자 비디오 컴포넌트 표시 */}
            {openvidu.subscribers.map((sub, i) => (
              <div key={i} className="h-full w-full z-80">
                <OpenViduVideoComponent
                  streamManager={sub}
                  muted={control.muted}
                  volume={control.volume}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="absolute flex flex-col justify-center items-center w-full h-full px-4 mb-8">
          <div className="relative bg-[#fff9d7] rounded-[20px] p-6 shadow-lg border-2 border-[#ffec8a] bg-notebook-pattern">            
            {/* 상담 안내문 */}
            <p className="text-base font-bold text-[#212121] mb-4">
              {meetingDate} {meetingTime} ~ {meetingEndTime}
            </p>
            <div className="text-sm text-[#212121] mb-6">
              <p className="font-bold mb-2">상담 중 지켜야 할 규칙</p>
              <ul className="list-none space-y-2">
                <li className="flex items-start">
                  <FaHandsHelping className="mr-2 text-[#ff6347]" size={20} />
                  <span className="flex-1">정중하고 예의바르게 대화해주세요.</span>
                </li>
                <li className="flex items-start">
                  <FaUserSecret className="mr-2 text-[#ff6347]" size={20} />
                  <span className="flex-1">사생활과 관련된 민감한 주제는 피해주세요.</span>
                </li>
                <li className="flex items-start">
                  <FaBan className="mr-2 text-[#ff6347]" size={20} />
                  <span className="flex-1">비난이나 부정적인 표현은 삼가해주세요.</span>
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
                    setTeacherVideoActive // 추가
                  )
                }
                className="w-20 h-8 bg-[#ffec8a] rounded-full flex items-center justify-center text-sm font-medium text-[#212121] hover:bg-[#fdda6e] transition-colors"
              >
                입장하기
              </button>
              <button
                onClick={() => handleOutClick()}
                className="w-20 h-8 bg-[#ffec8a] rounded-full flex items-center justify-center text-sm font-medium text-[#212121] hover:bg-[#fdda6e] transition-colors"
              >
                나가기
              </button>
            </div>
          </div>
        </div>
      )}
      {isSessionJoined && (
        <ParentMeetingFooter
          control={control}
          handleControl={setControl}
          close={() => leaveSession(openvidu, setOpenvidu, setIsSessionJoined)}
        />
      )}
    </div>
  )
}
