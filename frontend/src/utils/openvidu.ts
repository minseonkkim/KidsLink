import { OpenVidu, StreamEvent, StreamPropertyChangedEvent } from "openvidu-browser";
import { fetchRecordings, getToken } from "../api/openvidu";
import { OpenViduState, Recording, User } from "../types/openvidu";
import { getParentInfo } from "../api/Info";

export const joinSession = async (
  user: User,
  setOpenvidu: React.Dispatch<React.SetStateAction<OpenViduState>>,
  setIsSessionJoined: React.Dispatch<React.SetStateAction<boolean>>,
  setTeacherVideoActive: React.Dispatch<React.SetStateAction<boolean>>
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
      console.log(subscriber)
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
      setTeacherVideoActive(event.newValue);
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
      setIsSessionJoined(true);
    })
    .catch((error) => {
      console.log("There was an error connecting to the session:", error.code, error.message);
    });
    console.log(session)
    console.log("session")
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
