import {
  OpenVidu,
  StreamEvent,
  StreamPropertyChangedEvent,
} from "openvidu-browser";
import {
  fetchRecordings,
  fetchRecordingsByTeacherId,
  getToken,
} from "../api/openvidu";
import { OpenViduState, Recording, User } from "../types/openvidu";
import { getParentInfo } from "../api/info";

// TODO #2 08142231 범수 수정해야함
/* 변경전 코드
export const joinSession = async (
  user: User,
  setOpenvidu: React.Dispatch<React.SetStateAction<OpenViduState>>,
  setIsSessionJoined: React.Dispatch<React.SetStateAction<boolean>>,
  setMyStreamId: React.Dispatch<React.SetStateAction<string | undefined>>, // 이 매개변수 추가
  setOtherVideoActive: React.Dispatch<React.SetStateAction<boolean>> // 상대방 비디오 상태 추가
) => {
  if (!user.sessionId) {
    console.log("user", user);
    return;
  }
  const OV = new OpenVidu();
  OV.enableProdMode();
  const session = OV.initSession();

  // 이벤트 등록
  session.on("streamCreated", (event: StreamEvent) => {
    try {
      const subscriber = session.subscribe(event.stream, undefined, { insertMode: "REPLACE" });
      setOpenvidu((prevOpenvidu) => ({
        ...prevOpenvidu,
        subscribers: [...prevOpenvidu.subscribers, subscriber],
      }));
    } catch (error) {
      console.error("Error during stream subscription:", error);
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

  // 새로운 이벤트 등록: streamPropertyChanged
  // 수정 필요한 부분
  session.on("streamPropertyChanged", (event: StreamPropertyChangedEvent) => {
    console.log(session);
    console.log("session");
    if (event.changedProperty === "videoActive") {
      console.log("Video state changed for stream", event.stream.streamId, ":", event.newValue);

      const streamId = session.remoteStreamsCreated.keys();
      const streamKey = Array.from(streamId);
      const otherVideoActive = streamKey[0] === event.stream.streamId;

      // 자신의 스트림 ID와 비교하여 상태 로그 출력
      setMyStreamId((myStreamId) => {
        if (event.stream.streamId === myStreamId) {
          console.log("내 비디오 상태가 변경되었습니다:", event.newValue);
        } else {
          console.log("상대방 비디오 상태가 변경되었습니다:", event.newValue);
          setOtherVideoActive(Boolean(event.newValue)); // boolean으로 캐스팅
          console.log(otherVideoActive);
          console.log("openvidu에서 otherVideoActive");
        }
        return myStreamId;
      });
    }
  });

  const token = await getToken(user.sessionId);

  session
    .connect(token, { clientData: user.username })
    .then(async () => {
      const publisher = await OV.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: "1260x720",
        frameRate: 30,
        insertMode: "REPLACE",
        mirror: true,
      });
      session.publish(publisher);
      setOpenvidu((p) => ({
        ...p,
        session: session,
        mainStreamManager: publisher,
        publisher: publisher,
      }));

      // 자신의 스트림 ID 저장
      setMyStreamId(publisher.stream.streamId);
      setIsSessionJoined(true);
    })
    .catch((error) => {
      console.log("There was an error connecting to the session:", error.code, error.message);
    });

  console.log(session);
  console.log("session");
};
*/

// 세션 참가 및 스트림 구독 처리
export const joinSession = async (
  user: User,
  setOpenvidu: React.Dispatch<React.SetStateAction<OpenViduState>>,
  setIsSessionJoined: React.Dispatch<React.SetStateAction<boolean>>,
  setMyStreamId: React.Dispatch<React.SetStateAction<string | undefined>>,
  setOtherVideoActive: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (!user.sessionId) {
    return;
  }

  const OV = new OpenVidu();
  OV.enableProdMode();
  const session = OV.initSession();

  // 이벤트 등록
  session.on("streamCreated", (event: StreamEvent) => {
    try {
      const subscriber = session.subscribe(event.stream, undefined, {
        insertMode: "REPLACE",
      });
      setOpenvidu((prevOpenvidu) => ({
        ...prevOpenvidu,
        subscribers: [...prevOpenvidu.subscribers, subscriber],
      }));
    } catch (error) {
      console.error("Error during stream subscription:", error);
    }
  });

  session.on("streamDestroyed", (event: StreamEvent) => {
    setOpenvidu((prevOpenvidu) => {
      const streamManager = event.stream.streamManager;
      return {
        ...prevOpenvidu,
        subscribers: prevOpenvidu.subscribers.filter(
          (sub) => sub !== streamManager
        ),
      };
    });
  });

  session.on("streamPropertyChanged", (event: StreamPropertyChangedEvent) => {
    if (event.changedProperty === "videoActive") {
      setOtherVideoActive(Boolean(event.newValue));
    }
  });

  session.on("exception", (exception) => {
    console.warn(exception);
  });

  try {
    const token = await getToken(user.sessionId);
    await session.connect(token, { clientData: user.username });

    const publisher = await OV.initPublisherAsync(undefined, {
      audioSource: undefined,
      videoSource: undefined,
      publishAudio: true,
      publishVideo: true,
      resolution: "1260x720",
      frameRate: 30,
      insertMode: "REPLACE",
      mirror: true,
    });
    await session.publish(publisher);

    setOpenvidu((p) => ({
      ...p,
      session: session,
      mainStreamManager: publisher,
      publisher: publisher,
    }));

    setMyStreamId(publisher.stream.streamId);
    setIsSessionJoined(true);
  } catch (error) {
    console.log("There was an error connecting to the session:", error);
  }
};

// TODO #2 여기까지

export const leaveSession = async (
  openvidu: OpenViduState,
  setOpenvidu: React.Dispatch<React.SetStateAction<OpenViduState>>,
  setIsSessionJoined: React.Dispatch<React.SetStateAction<boolean>>,
  navigate: (path: string) => void
) => {
  if (openvidu.session) {
    try {
      // 퍼블리셔가 있을 경우 카메라 및 마이크를 안전하게 해제
      if (openvidu.publisher) {
        openvidu.publisher.stream.disposeWebRtcPeer(); // 웹RTC 피어를 안전하게 종료
        openvidu.publisher.stream.disposeMediaStream(); // 미디어 스트림을 안전하게 종료
        openvidu.publisher = undefined;
      }

      // 세션을 안전하게 종료
      openvidu.session.disconnect();
    } catch (error) {
      console.error("Error during session disconnect:", error);
    } finally {
      // 상태를 초기화하고, 세션 종료 플래그를 false로 설정
      setOpenvidu((prevOpenvidu) => ({
        ...prevOpenvidu,
        session: undefined,
        mainStreamManager: undefined,
        publisher: undefined,
        subscribers: [],
      }));
      setIsSessionJoined(false);
      navigate("/meeting"); // /meeting 페이지로 이동
    }
  } else {
    console.warn("No active session to leave.");
    navigate("/meeting");
  }
};

export const fetchParentInfo = async (
  setParentInfo: React.Dispatch<React.SetStateAction<any>>,
  setUser: React.Dispatch<React.SetStateAction<User>>
) => {
  try {
    const fetchedParentInfo = await getParentInfo();
    setParentInfo(fetchedParentInfo);
    setUser((prevUser) => ({
      ...prevUser,
      username: fetchedParentInfo.child.name,
    }));
  } catch (error) {
    console.error("Failed to fetch parent info:", error);
  }
};

export const fetchRecordingsList = async (
  setRecordings: React.Dispatch<React.SetStateAction<Recording[]>>
) => {
  try {
    const recordings = await fetchRecordings();
    setRecordings(recordings);
  } catch (error) {
    console.error("Error fetching recordings:", error);
  }
};

export const fetchRecordingsListByTeacherId = async (teacherId: number) => {
  try {
    const recordings = await fetchRecordingsByTeacherId(teacherId);
    return recordings;
  } catch (error) {
    console.error("Error fetching recordings:", error);
  }
};
