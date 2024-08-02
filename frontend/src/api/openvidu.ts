import axios from "axios";
import axiosInstance from "./token/axiosInstance";

const APPLICATION_SERVER_URL = import.meta.env.VITE_OPENVIDU_URL
const OPENVIDU_SERVER_SECRET = "MY_SECRET";

export const getToken = async (mySessionId: string): Promise<string> => {
  const sessionId = await createSession(mySessionId);
  return await createToken(sessionId);
};

const createSession = async (sessionId: string): Promise<string> => {
  const response = await axios.post(
    `${APPLICATION_SERVER_URL}/sessions`, { customSessionId: sessionId },
    {
      headers: {
        "Content-Type": "application/json",
      }
    }
  );
  return response.data; // 세션 ID 반환, data.id를 통해 올바른 값 추출
};

const createToken = async (sessionId: string): Promise<string> => {
  console.log(APPLICATION_SERVER_URL)
  const response = await axios.post(
    `${APPLICATION_SERVER_URL}/sessions/${sessionId}/connections`,
    {},
    {
        headers: { 'Content-Type': 'application/json', },
    }
  );
  console.log(response)
  return response.data; // 토큰 반환
};


// 녹화 시작
const startRecording = async (sessionId: string): Promise<string> => {
  try {
    const response = await axios.post(
      `${APPLICATION_SERVER_URL}/sessions/${sessionId}/recordings/start`,
      {
        outputMode: "COMPOSED",
        recordingMode: "ALWAYS",
        name: "recording-name",
        hasAudio: true,
        hasVideo: true
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data; 
  } catch (error) {
    console.error("Error starting recording:", error);
    throw error;
  }
};

// 녹화 중지
export const stopRecording = async (recordingId: string): Promise<Recording> => {
  try {
    const response = await axios.post(
      `${APPLICATION_SERVER_URL}/recordings/stop/${recordingId}`,
      {},
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data; 
  } catch (error) {
    console.error("Error stopping recording:", error);
    throw error;
  }
};


//녹화된 영상 가져오기
export const fetchRecordings = async (): Promise<Recording[]> => {
  try {
    const response = await axios.get(`${APPLICATION_SERVER_URL}/recordings`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recordings:", error);
    throw error;
  }
};




// 욕설감지
const detectProfanity = (text: string): boolean => {
  const profanityList = ['김범수', '바보']; // Add more words as needed
  return profanityList.some(word => text.includes(word));
};

// stt()
export const handleSpeechRecognition = async (sessionId: string, setRecordingId: React.Dispatch<React.SetStateAction<string | null>>) => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = async (event) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        const transcript = event.results[i][0].transcript;
        console.log(transcript);
        if (detectProfanity(transcript)) {
          console.log("Profanity detected. Starting recording...");
          const recordingId = await startRecording(sessionId);
          console.log(`Recording started with ID: ${recordingId}`);
          setRecordingId(recordingId);
        }
      }
    }
  };

  recognition.start();
};
