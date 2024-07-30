import { OpenVidu, Publisher, Session, StreamEvent, StreamManager, Subscriber } from "openvidu-browser";
import React, { ChangeEvent, useEffect, useState } from "react";
import OpenViduVideoComponent from "../../components/openvidu/Ovvideo";
import MeetingFooter from "../../components/openvidu/MeetingFooter";
import { getToken } from "../../api/openvidu";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";


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

export default function TeacherBroadcast() {
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

  useEffect(() => {
    // sessionId 받아오기
    setUser((prevUser) => ({ ...prevUser, sessionId: "sessionC" }));
    return () => {
      leaveSession();
    };
  }, []);

  useEffect(() => {
  }, [user]);

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


  return (
    <div className="bg-gray-300 flex flex-col justify-center items-center m-auto w-screen h-screen min-w-[1000px] overflow-hidden">
      <TeacherHeader />
      {openvidu.session ? (
        <div className="flex w-full h-full">
          <div className="relative flex flex-col justify-center items-center w-full h-full">
            <div className="absolute top-[150px] left-0 w-[700px] h-auto rounded-lg border border-black">
              {/* 내 화면 */}
              <h1>내 화면</h1>
              {openvidu.mainStreamManager && (
                <OpenViduVideoComponent streamManager={openvidu.mainStreamManager} />
              )}
            </div>
            <div className="absolute top-[150px] right-0 w-[700px] h-auto rounded-lg border border-black">
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
      <MeetingFooter
        control={control}
        handleControl={setControl}
        close={leaveSession}
      />
    </div>
  );
}