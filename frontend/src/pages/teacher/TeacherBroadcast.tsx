import { OpenVidu, Publisher, Session, StreamEvent, StreamManager, Subscriber } from "openvidu-browser";
import React, { ChangeEvent, useEffect, useState } from "react";
import styled from "styled-components";
import OpenViduVideoComponent from "../../components/openvidu/Ovvideo";
import MeetingHeader from "../../components/openvidu/MeetingHeader";
import MeetingFooter from "../../components/openvidu/MeetingFooter";
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

export default function Openvidutest() {
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
    setUser((prevUser) => ({ ...prevUser, sessionId: "sessionB" }));
    return () => {
      leaveSession();
    };
  }, []);

  useEffect(() => {
    // console.log(user);
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
    console.log(session)
    console.log("session")
    
    // 이벤트 등록
    
    // session.on("streamCreated", (event: StreamEvent) => {
    //   try {
    //     const subscriber = session.subscribe(event.stream, undefined);
    //     setOpenvidu((prevOpenvidu) => ({
    //       ...prevOpenvidu,
    //       subscribers: [...prevOpenvidu.subscribers, subscriber],
    //     }));
    //   } catch (error) {
    //     console.error("Error during stream subscription:", error);
    //     // 사용자에게 오류 메시지 표시 또는 로그 전송
    //   }
    // });

    // session.on("streamDestroyed", (event: StreamEvent) => {
    //   setOpenvidu((prevOpenvidu) => {
    //     const streamManager = event.stream.streamManager;
    //     return {
    //       ...prevOpenvidu,
    //       subscribers: prevOpenvidu.subscribers.filter((sub) => sub !== streamManager),
    //     };
    //   });
    // });

    // session.on("exception", (exception) => {
    //   console.warn(exception);
    // });

    try {
      const token = await getToken(user.sessionId);
      console.log("token")
      console.log(token)
      await session.connect(token, { clientData: user.username });
      const publisher = await OV.initPublisherAsync(undefined, {
        audioSource: undefined, // 기본 마이크
        videoSource: undefined, // 기본 웹캠
        publishAudio: true,
        publishVideo: true,
        resolution: "1260x720",
        frameRate: 30,
        insertMode: "APPEND",
        mirror: false,
      });

      session.publish(publisher);
      setOpenvidu((prevOpenvidu) => ({
        ...prevOpenvidu,
        session: session,
        mainStreamManager: publisher,
        publisher: publisher,
      }));
    } catch (error) {
      console.error("There was an error connecting to the session:", error);
    }
  };

  return (
    <Div>
      <MeetingHeader tabOpen={tabOpen} handleTabOpen={setTabOpen} meetingNo={123} />
      {openvidu.session ? (
        <MainDiv>
          <VideoDiv>
            <UserVideo>
              {openvidu.mainStreamManager && (
                <OpenViduVideoComponent streamManager={openvidu.mainStreamManager} />
              )}
            </UserVideo>
            <CallVideo>
              {openvidu.subscribers.map((sub, i) => (
                <OpenViduVideoComponent
                  key={i}
                  streamManager={sub}
                  muted={control.muted}
                  volume={control.volume}
                />
              ))}
            </CallVideo>
          </VideoDiv>
          {(tabOpen.formTab || tabOpen.profileTab || tabOpen.chatTab) && (
            <SideDiv>
              {tabOpen.formTab && <TabDiv>form</TabDiv>}
              {tabOpen.profileTab && <TabDiv>profile</TabDiv>}
              {tabOpen.chatTab && <TabDiv>chat</TabDiv>}
            </SideDiv>
          )}
        </MainDiv>
      ) : (
        <ButtonDiv>
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
        </ButtonDiv>
      )}
      <MeetingFooter
        control={control}
        handleControl={setControl}
        close={leaveSession}
      />
    </Div>
  );
}

const Div = styled.div`
  background-color: #d9d9d9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
  width: 100vw;
  height: 100vh;
  min-width: 1000px;
  overflow: hidden;
`;

const ButtonDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const MainDiv = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const VideoDiv = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const UserVideo = styled.div`
  position: absolute;
  top: 50px;
  right: 50px;
  width: 315px;
  height: px;
  border-radius: 8px;
  border: black 1px solid;
`;

const CallVideo = styled.div`
  width: fit-content;
  height: 100%;
  flex-grow: 1;
`;

const SideDiv = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 0 0 400px;
`;

const TabDiv = styled.div`
  flex: 1 0 0;
  width: 100%;
`;
