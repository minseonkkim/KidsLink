import { useState, useEffect } from "react";
import Draggable from "react-draggable";
import bgImg from "../../assets/parent/meeting_bg.png";
import OpenViduVideoComponent from "../../components/openvidu/VideoComponent";
import ParentMeetingFooter from "../../components/openvidu/ParentMeetingFooter";
import { useParams } from "react-router-dom";
import { useParentInfoStore } from "../../stores/useParentInfoStore";
import { ControlState, OpenViduState, User } from "../../types/openvidu";
import {
  fetchParentInfo,
  joinSession,
  leaveSession,
} from "../../utils/openvidu";
import { GetMeetingInfo } from "../../api/meeting";

export default function ParentVideo() {
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
  const [isSessionJoined, setIsSessionJoined] = useState(false); // 세션이 연결되었는지 여부를 나타내는 상태 추가
  const [teacherName, setTeacherName] = useState("");
  const [otherVideoActive, setOtherVideoActive] = useState(false); // 상대방 비디오 상태 추가

  useEffect(() => {
    const fetchTeacherName = async () => {
      try {
        const res = await GetMeetingInfo(parseInt(meetingId));
        setTeacherName(res.teacherName);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTeacherName();
  }, [meetingId]);

  useEffect(() => {
    if (!parentInfo) {
      fetchParentInfo(setParentInfo, setUser);
    } else {
      setUser((prevUser) => ({ ...prevUser, username: parentInfo.child.name }));
    }
  }, [parentInfo, setParentInfo]);

  useEffect(() => {
    if (openvidu.publisher) {
      openvidu.publisher.publishAudio(control.mic);
      openvidu.publisher.publishVideo(control.video);
    }
  }, [control, openvidu.publisher]);

  // Define the opacity style based on the control.video state
  const parentVideoOpacity = control.video ? 1 : 0.8;
  const teacherVideoOpacity = otherVideoActive ? 1 : 0.6; // 상대방의 비디오 상태에 따라 결정

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat px-4 pt-4"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      {openvidu.session ? (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <Draggable>
            <div
              className="absolute top-4 right-4 w-[120px] h-[150px] rounded-lg border border-white z-50 bg-black cursor-move flex items-center justify-center"
              style={{ opacity: parentVideoOpacity, backgroundColor: "white" }}
            >
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
          <div
            className="absolute top-20 bg-white w-[90%] h-[calc(70vh)] rounded-lg z-40 flex items-center justify-center"
            style={{ opacity: teacherVideoOpacity, backgroundColor: "white" }}
          >
            {!otherVideoActive && (
              <div className="absolute z-50 text-white text-opacity-100">
                교사
              </div>
            )}
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
          <div className="relative w-full bg-[#fff9d7] rounded-[20px] px-4 py-6 shadow-lg border-2 border-[#ffec8a] bg-notebook-pattern">
            {/* 테이프 효과 */}
            <div className="absolute -top-4 -left-4 w-12 h-6 bg-yellow-300 rotate-12 transform z-10"></div>
            <div className="absolute -top-4 -right-4 w-12 h-6 bg-yellow-300 -rotate-12 transform z-10"></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-6 bg-yellow-300 -rotate-12 transform z-10"></div>
            <div className="absolute -bottom-4 -right-4 w-12 h-6 bg-yellow-300 rotate-12 transform z-10"></div>

            <p className="text-lg font-bold text-[#212121] mb-2">
              상담번호 : {user.sessionId}
            </p>
            <p className="text-base font-light text-[#353c4e] mb-4">
              {teacherName} 선생님과의 면담입니다.
            </p>
            <div className="text-sm text-[#212121] space-y-2 whitespace-pre-line">
              안내문입니다.
            </div>
            <div className="flex justify-center">
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
                className="mt-4 w-[80px] h-[35px] bg-[#ffec8a] rounded-full flex items-center justify-center text-base font-medium text-[#212121]"
              >
                연결
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
  );
}
