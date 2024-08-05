import { OpenVidu, StreamEvent, StreamPropertyChangedEvent } from "openvidu-browser";
import { fetchRecordings, getToken } from "../api/openvidu";
import { OpenViduState, Recording, User } from "../types/openvidu";
import { getParentInfo } from "../api/Info";

export const joinSession = async (
  user: User,
  setOpenvidu: React.Dispatch<React.SetStateAction<OpenViduState>>,
  setIsSessionJoined: React.Dispatch<React.SetStateAction<boolean>>,
  setMyStreamId: React.Dispatch<React.SetStateAction<string | undefined>>, // 이 매개변수 추가
  setOtherVideoActive: React.Dispatch<React.SetStateAction<boolean>> // 상대방 비디오 상태 추가
) => {
  if (!user.sessionId) return;
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
      console.log(subscriber);
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
  session.on("streamPropertyChanged", (event: StreamPropertyChangedEvent) => {
    if (event.changedProperty === "videoActive") {
      console.log("Video state changed for stream", event.stream.streamId, ":", event.newValue);
      const streamId = session.remoteStreamsCreated.keys();
      const streamKey = Array.from(streamId);
      const otherVideoActive = (streamKey[0] === event.stream.streamId);
      console.log("상대 카메라 껐다 켰다 할 때");
      console.log(streamKey[0] === event.stream.streamId);
      setOtherVideoActive(otherVideoActive); // 상대방 비디오 상태 업데이트

      // 자신의 스트림 ID와 비교
      setMyStreamId((myStreamId) => {
        if (event.stream.streamId === myStreamId) {
          console.log("내 비디오 상태가 변경되었습니다:", event.newValue);
        } else {
          console.log("상대방 비디오 상태가 변경되었습니다:", event.newValue);
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

export const leaveSession = (
  openvidu: OpenViduState,
  setOpenvidu: React.Dispatch<React.SetStateAction<OpenViduState>>,
  setIsSessionJoined: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (openvidu.session) {
    openvidu.session.disconnect();
    setOpenvidu((prevOpenvidu) => ({
      ...prevOpenvidu,
      session: undefined,
      mainStreamManager: undefined,
      publisher: undefined,
      subscribers: [],
    }));
    setIsSessionJoined(false);
  }
};

export const fetchParentInfo = async (
  setParentInfo: React.Dispatch<React.SetStateAction<any>>,
  setUser: React.Dispatch<React.SetStateAction<User>>
) => {
  try {
    const fetchedParentInfo = await getParentInfo();
    setParentInfo(fetchedParentInfo);
    setUser(prevUser => ({ ...prevUser, username: fetchedParentInfo.child.name }));
  } catch (error) {
    console.error('Failed to fetch parent info:', error);
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