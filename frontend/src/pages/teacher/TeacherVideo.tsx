import { OpenVidu, Publisher, Session, StreamEvent, StreamManager, Subscriber } from "openvidu-browser";
import { useParams } from "react-router-dom";
import React, { ChangeEvent, useEffect, useState } from "react";
import OpenViduVideoComponent from "../../components/openvidu/VideoComponent";
import MeetingFooter from "../../components/openvidu/TeacherMeetingFooter";
import { getToken, handleSpeechRecognition, stopRecording, fetchRecordings } from "../../api/openvidu";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import MeetingBackground from "../../assets/teacher/meeting_background.png";
import { useTeacherInfoStore } from "../../stores/useTeacherInfoStore";
import { getTeacherInfo } from "../../api/Info";
import axios from 'axios';
const APPLICATION_SERVER_URL = import.meta.env.VITE_OPENVIDU_URL

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

interface Recording {
  id: string;
  name: string;
  url: string;
}

export default function TeacherVideo() {
  const { meetingId } = useParams<{ meetingId: string }>(); // useParams 훅을 사용하여 URL 파라미터에서 meetingId를 가져옴
  const { teacherInfo, setTeacherInfo } = useTeacherInfoStore();
  const [user, setUser] = useState<User>({
    sessionId: meetingId, // meetingId를 sessionId로 설정
    username: teacherInfo?.name || '',
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
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [currentRecordingId, setCurrentRecordingId] = useState<string | null>(null);
  useEffect(() => {
    async function fetchTeacherInfo() {
      try {
        const fetchedTeacherInfo = await getTeacherInfo();
        setTeacherInfo(fetchedTeacherInfo);
        setUser(prevUser => ({ ...prevUser, username: fetchedTeacherInfo.name }));
      } catch (error) {
        console.error('Failed to fetch teacher info:', error);
      }
    }

    if (!teacherInfo) {
      fetchTeacherInfo();
    } else {
      setUser(prevUser => ({ ...prevUser, username: teacherInfo.name }));
    }
  }, [teacherInfo, setTeacherInfo]);

  useEffect(() => {
    fetchRecordingsList();
  }, []);

  useEffect(() => {
    // 녹화 파일 목록 불러오기
    fetchRecordings();
  }, []);

  useEffect(() => {
    if (openvidu.publisher) {
      openvidu.publisher.publishAudio(control.mic);
      openvidu.publisher.publishVideo(control.video);
    }
  }, [control, openvidu.publisher]);

  const handleUserChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUser((prevUser) => ({ ...prevUser, [event.target.name]: event.target.value }));
  };

  const leaveSession = () => {
    if (openvidu.session) {
      openvidu.session.disconnect();
      setOpenvidu((prevOpenvidu) => ({ ...prevOpenvidu, session: undefined, mainStreamManager: undefined, publisher: undefined, subscribers: [] }));
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
        setOpenvidu((prevOpenvidu) => ({ ...prevOpenvidu, subscribers: [...prevOpenvidu.subscribers, subscriber] }));
      } catch (error) {
        console.error("Error during stream subscription:", error);
      }
    });

    session.on("streamDestroyed", (event: StreamEvent) => {
      setOpenvidu((prevOpenvidu) => {
        const streamManager = event.stream.streamManager;
        return { ...prevOpenvidu, subscribers: prevOpenvidu.subscribers.filter((sub) => sub !== streamManager) };
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
          audioSource: undefined, // 기본 마이크 사용
          videoSource: undefined, // 기본 웹캠 사용
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

        // 음성 인식 및 비속어 감지 시작
        await handleSpeechRecognition(user.sessionId);
      })
      .catch((error) => {
        console.error("There was an error connecting to the session:", error);
      });
  };

  const fetchRecordings = async () => {
    try {
      const response = await axios.get(`${APPLICATION_SERVER_URL}/recordings`);
      setRecordings(response.data);
    } catch (error) {
      console.error('Error fetching recordings:', error);
    }
  };

  const fetchRecordingsList = async () => {
    try {
      const recordings = await fetchRecordings();
      setRecordings(recordings);
    } catch (error) {
      console.error("Error fetching recordings:", error);
    }
  };
  const handleStopRecording = async () => {
    if (currentRecordingId) {
      try {
        const stoppedRecording = await stopRecording(currentRecordingId);
        console.log(`Recording stopped: ${stoppedRecording.id}`);
        setCurrentRecordingId(null);
        fetchRecordingsList();
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    }
  };
  return (
    <div className="relative flex flex-col justify-center items-center w-screen h-screen min-w-[1000px] overflow-hidden">
    <img src={MeetingBackground} className="absolute top-0 left-0 w-full h-full object-cover" />
    <div className="relative z-10 w-full h-full flex flex-col items-center">
    <TeacherHeader />
        {openvidu.session ? (
          <div className="relative w-full h-full flex">
            <div className="absolute top-[150px] left-0 w-[700px] h-auto rounded-lg border border-black">
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
        ) : (
          <div className="flex flex-col justify-center items-center w-full h-full">
            <p>상담번호 : {user.sessionId}</p>
            <p>참가자 : {user.username}</p>
            <p>안내문안내문안내문안내문안내문안내문</p>
            <button onClick={joinSession}>연결</button>
          </div>
        )}
        <MeetingFooter
          control={control}
          handleControl={setControl}
          close={leaveSession}
        />
      {/* 녹화 파일 목록 추가 */}
      <div className="recordings-list mt-4">
        <h2>녹화 파일 목록</h2>
        <ul>
          {recordings.map((recording) => (
            <li key={recording.id}>
              {recording.name} - <a href={recording.url} target="_blank" rel="noopener noreferrer">다운로드</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
  );
}
