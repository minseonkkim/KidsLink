import { useState, useEffect } from 'react';
import bgImg from "../../assets/parent/meeting_bg.png";
import OpenViduVideoComponent from "../../components/openvidu/VideoComponent";
import ParentMeetingFooter from '../../components/openvidu/ParentMeetingFooter';
import { useParams } from 'react-router-dom';
import { useParentInfoStore } from '../../stores/useParentInfoStore';
import { ControlState } from '../../types/meeting';
import { OpenViduState, User } from '../../types/openvidu';
import { fetchParentInfo, joinSession, leaveSession } from '../../utils/openvidu';
import { GetMeetingInfo } from '../../api/meeting';

export default function ParentVideo() {
  const { meetingId } = useParams<{ meetingId: string }>(); // useParams 훅을 사용하여 URL 파라미터에서 meetingId를 가져옴
  const { parentInfo, setParentInfo } = useParentInfoStore();
  const [user, setUser] = useState<User>({
    sessionId: meetingId,
    username: parentInfo?.child?.name || ''
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
  const [teacherName, setTeacherName] = useState('');

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
      setUser(prevUser => ({ ...prevUser, username: parentInfo.child.name }));
    }
  }, [parentInfo, setParentInfo]);

  useEffect(() => {
    if (openvidu.publisher) {
      openvidu.publisher.publishAudio(control.mic);
      openvidu.publisher.publishVideo(control.video);
    }
  }, [control, openvidu.publisher]);

  return (
    <div className="relative min-h-[100dvh] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${bgImg})` }}>
      <div className="absolute inset-0 bg-black bg-opacity-75"></div>
        {openvidu.session ? (
          <div className="relative w-full h-full flex">
            <div className="absolute top-[500px] right-[20px] w-[200px] h-[200px] rounded-lg border border-white z-50 bg-white">
              <h1>내 화면</h1>
              <div className="h-[200px]">
                {openvidu.mainStreamManager && (
                  <OpenViduVideoComponent streamManager={openvidu.mainStreamManager} />
                )}
              </div>
            </div>
            <div className="absolute w-full h-[calc(87vh-80px)] rounded-lg border border-white z-40 bg-white">
              <h1>상대 화면</h1>
              {openvidu.subscribers.map((sub, i) => (
                <div key={i} className="h-full">
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
            <div className="absolute flex flex-col justify-center items-center w-full h-full px-6 mb-8">
              <div className="relative w-full bg-[#fff9d7] rounded-[20px] px-6 py-8 shadow-lg border-2 border-[#ffec8a] bg-notebook-pattern">
              {/* 테이프 효과 */}
              <div className="absolute -top-4 -left-4 w-16 h-8 bg-yellow-300 rotate-12 transform z-10"></div>
              <div className="absolute -top-4 -right-4 w-16 h-8 bg-yellow-300 -rotate-12 transform z-10"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-8 bg-yellow-300 -rotate-12 transform z-10"></div>
              <div className="absolute -bottom-4 -right-4 w-16 h-8 bg-yellow-300 rotate-12 transform z-10"></div>

              <p className="text-xl font-bold text-[#212121] mb-2">
                상담번호 : {user.sessionId}
              </p>
              <p className="text-l font-light text-[#353c4e] mb-6">
                {teacherName} 선생님과의 면담입니다.
              </p>
              <div className="text-base text-[#212121] space-y-4 whitespace-pre-line">
                안내문안내문안내문안내문안내문안내문안내문
              </div>
              <div className="flex justify-center">
                  <button onClick={() => joinSession(user, setOpenvidu, setIsSessionJoined)} className="mt-5 w-[99px] h-[40px] bg-[#ffec8a] rounded-full flex items-center justify-center text-base font-medium text-[#212121]">연결</button>
                </div>
            </div>
          </div>
        )}
        {isSessionJoined && (
          <ParentMeetingFooter control={control} handleControl={setControl} close={() => leaveSession(openvidu, setOpenvidu, setIsSessionJoined)} />
        )}
      </div>
  );
}
