import { useState, useEffect, ChangeEvent } from 'react';
import { IoMicOutline, IoMicOffOutline, IoVideocamOffOutline, IoVideocamOutline } from "react-icons/io5";
import bgImg from "../../assets/parent/meeting_bg.png";
import OpenViduVideoComponent from "../../components/openvidu/Ovvideo";
import MeetingFooter from "../../components/openvidu/MeetingFooter";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import { OpenVidu, Publisher, Session, StreamEvent, StreamManager, Subscriber } from "openvidu-browser";
import { getToken } from "../../api/openvidu";

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

export default function ParentMeeting() {
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [user, setUser] = useState<User>({
    sessionId: undefined,
    username: "user1",
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
    // sessionId 받아오기
    setUser((prevUser) => ({ ...prevUser, sessionId: "sessionC" }));
    return () => {
      leaveSession();
    };
  }, []);

  useEffect(() => {
    if (openvidu.publisher) {
      openvidu.publisher.publishAudio(control.mic);
      openvidu.publisher.publishVideo(control.video);
    }
  }, [control, openvidu.publisher]);

  const handleUserChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUser((prevUser) => ({
      ...prevUser,
      [event.target.name]: event.target.value,
    }));
  };

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
        // console.log(
        //   "There was an error connecting to the session:",
        //   error.code,
        //   error.message
        // );
      });
  };

  const toggleMic = () => setIsMicOn(prev => !prev);
  const toggleVideo = () => setIsVideoOn(prev => !prev);

  return (
    <div className="min-h-[100dvh]">
      {/* div박스의 배경으로 */}
      {/* <img src={bgImg} className="w-full h-full object-cover" alt='meeting'/> */}
      <div className="inset-0 w-full h-full bg-[#897153] mix-blend-multiply" />
          <div className="bottom-8 w-[455px] h-[50px] left-1/2 transform -translate-x-1/2 flex space-x-4 justify-center">
            <div className="bg-white p-2 rounded-full opacity-90 cursor-pointer" onClick={toggleMic}>
        
        {openvidu.session ? (
          <div className="w-full h-full flex">
            <div className="top-[150px] left-0 w-[700px] h-auto rounded-lg border border-black">
              <h1>내 화면</h1>
              {openvidu.mainStreamManager && (
                <OpenViduVideoComponent streamManager={openvidu.mainStreamManager} />
              )}
            </div>
            <div className="top-[150px] right-0 w-[700px] h-auto rounded-lg border border-black">
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
            <input
              name="sessionId"
              value={user.sessionId || ""}
              onChange={handleUserChange}
            />
            <input
              name="username"
              value={user.username || ""}
              onChange={handleUserChange}
            />
            <button onClick={joinSession}>연결</button>
          </div>
        )}
        <MeetingFooter control={control} handleControl={setControl} close={leaveSession} />
      </div>
    </div>
  </div>
  );
}
