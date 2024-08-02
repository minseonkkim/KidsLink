import { useState, useEffect, ChangeEvent } from 'react';
import { IoMicOutline, IoMicOffOutline, IoVideocamOffOutline, IoVideocamOutline } from "react-icons/io5";
import bgImg from "../../assets/parent/meeting_bg.png";
import OpenViduVideoComponent from "../../components/openvidu/VideoComponent";
import MeetingFooter from "../../components/openvidu/TeacherMeetingFooter";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import { OpenVidu, Publisher, Session, StreamEvent, StreamManager, Subscriber } from "openvidu-browser";
import { getToken } from "../../api/openvidu";
import { useParams } from 'react-router-dom';
import { useParentInfoStore } from '../../stores/useParentInfoStore';
import ParentMeetingFooter from '../../components/openvidu/ParentMeetingFooter';
import { getParentInfo } from '../../api/Info';

interface User {
  sessionId?: string;
  username: string;
}

interface OpenViduState {
  session?: Session;
  mainStreamManager?: StreamManager;
  publisher?: Publisher;
  subscribers: Subscriber[];
}

interface TabState {
  formTab: boolean;
  profileTab: boolean;
  chatTab: boolean;
}

interface ControlState {
  video: boolean;
  mic: boolean;
  muted: boolean;
  volume: number;
}

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

  useEffect(() => {
    async function fetchParentInfo() {
      try {
        const fetchedParentInfo = await getParentInfo();
        setParentInfo(fetchedParentInfo);
        setUser(prevUser => ({ ...prevUser, username: fetchedParentInfo.child.name }));
      } catch (error) {
        console.error('Failed to fetch parent info:', error);
      }
    }

    if (!parentInfo) {
      fetchParentInfo();
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

  const leaveSession = () => {
    if (openvidu.session) {
      openvidu.session.disconnect();
      setOpenvidu((prevOpenvidu) => ({
        ...prevOpenvidu,
        session: undefined,
        mainStreamManager: undefined,
        publisher: undefined,
        subscribers: [],
      }));
    }
  };

  const joinSession = async () => {
    if (!user.sessionId) return;
    const OV = new OpenVidu();
    OV.enableProdMode();
    const session = OV.initSession();
    
    // 이벤트 등록
    session.on("streamCreated", (event: StreamEvent) => {
      try {
        const subscriber = session.subscribe(event.stream, undefined);
        setOpenvidu((prevOpenvidu) => ({
          ...prevOpenvidu,
          subscribers: [...prevOpenvidu.subscribers, subscriber],
        }));
      } catch (error) {
        console.error("Error during stream subscription:", error);
        // 사용자에게 오류 메시지 표시 또는 로그 전송
      }
    });

    session.on("streamDestroyed", (event: StreamEvent) => {
      setOpenvidu((prevOpenvidu) => {
        const streamManager = event.stream.streamManager;
        return {
          ...prevOpenvidu,
          subscribers: prevOpenvidu.subscribers.filter((sub) => sub !== streamManager),
        };
      });
    });

    session.on("exception", (exception) => {
      console.warn(exception);
    });
    const token = await getToken(user.sessionId);

    session
      .connect(token, { clientData: user.username })
      .then(async () => {
        const publisher = await OV.initPublisherAsync(undefined, {
          audioSource: undefined, // The source of audio. If undefined default microphone
          videoSource: undefined, // The source of video. If undefined default webcam
          publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
          publishVideo: true, // Whether you want to start publishing with your video enabled or not
          resolution: "1260x720", // The resolution of your video
          frameRate: 30, // The frame rate of your video
          insertMode: "REPLACE", // How the video is inserted in the target element 'video-container'
          mirror: true, // Whether to mirror your local video or not
        });
        session.publish(publisher);
        setOpenvidu((p) => ({
          ...p,
          session: session,
          mainStreamManager: publisher,
          publisher: publisher,
        }));
      })
      .catch((error) => {
        console.log(
          "There was an error connecting to the session:",
          error.code,
          error.message
        );
      });
  };

  return (
    <div className="relative min-h-[100dvh] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${bgImg})` }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        {openvidu.session ? (
          <div className="w-full h-full flex">
            <div className="top-[150px] left-0 w-[700px] h-auto rounded-lg border border-white">
              <h1>내 화면</h1>
              {openvidu.mainStreamManager && (
                <OpenViduVideoComponent streamManager={openvidu.mainStreamManager} />
              )}
            </div>
            <div className="absolute top-[50px] h-full w-[1200px] h-auto rounded-lg border border-white">
              <h1>상대 화면</h1>
              {openvidu.subscribers.map((sub, i) => (
                <OpenViduVideoComponent
                  key={i}
                  streamManager={sub}
                  muted={control.muted}
                  volume={control.volume}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center w-full h-full">
            <p>상담번호 : {user.sessionId}</p>
            <p>참가자 : {user.username} 보호자</p>
            <p>안내문안내문안내문안내문안내문안내문</p>
            <button onClick={joinSession}>연결</button>
          </div>
        )}
        <ParentMeetingFooter control={control} handleControl={setControl} close={leaveSession}/>
      </div>
  );
}
