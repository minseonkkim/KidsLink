import axios from "axios";
import axiosInstance from "./token/axiosInstance";

const APPLICATION_SERVER_URL = import.meta.env.VITE_OPENVIDU_URL;
const OPENVIDU_SERVER_SECRET = import.meta.env.VITE_OPENVIDU_SECRET;

interface Recording {
  id: string;
  name: string;
  url: string; // Assuming the URL to access the recording is available
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const getToken = async (mySessionId: string): Promise<string> => {
  const sessionId = await createSession(mySessionId);
  return await createToken(sessionId);
};

const createSession = async (sessionId: string): Promise<string> => {
  const response = await axios.post(
    `${APPLICATION_SERVER_URL}/sessions`,
    { customSessionId: sessionId },
    {
      headers: {
        "Content-Type": "application/json",
      }
    }
  );
  return response.data; // 세션 ID 반환, data.id를 통해 올바른 값 추출
};

const createToken = async (sessionId: string): Promise<string> => {
  const response = await axios.post(
    `${APPLICATION_SERVER_URL}/sessions/${sessionId}/connections`,
    {},
    {
      headers: { "Content-Type": "application/json" },
    }
  );
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
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    console.error("Error starting recording:", error);
    throw error;
  }
};

// 녹화 중지
export const stopRecording = async (recordingId: string): Promise<any> => {
  try {
    const response = await axios.post(
      `${APPLICATION_SERVER_URL}/recordings/stop/${recordingId}`,
      {},
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    console.error("Error stopping recording:", error);
    throw error;
  }
};

// 녹화된 영상 가져오기
export const fetchRecordings = async (sessionId: string): Promise<any[]> => {
  try {
    const response = await axiosInstance.get(`${import.meta.env.VITE_OPENVIDU_URL}/recordings/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recordings:", error);
    throw error;
  }
};

// 욕설 감지
const detectProfanity = (text: string): boolean => {
  const profanityList = ["김범수", "바보"]; // Add more words as needed
  return profanityList.some((word) => text.includes(word));
};

// stt()
export const handleSpeechRecognition = async ( 
  sessionId: string,
  setRecordingId: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.error("SpeechRecognition not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = async (event) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        const transcript = event.results[i][0].transcript;
        console.log(transcript);
        if (detectProfanity(transcript)) {
          console.log("Profanity detected. Starting recording...");
          alert("욕설이 감지되었습니다. 녹화가 시작됩니다."); // 알림창 추가 ----> ***************TODO : 수정필요*************
          const recordingId = await startRecording(sessionId);
          console.log("Recording started with ID:", recordingId);
          setRecordingId(recordingId);
          recognition.stop(); // 중복 녹화를 방지하기 위해 감지 중지
        }
      }
    }
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };

  recognition.start();
};

export const stopSpeechRecognition = () => {
  const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (recognition) {
    recognition.stop();
  }
};

// 녹화 다운로드
export const handleDownload = async (userSessionId, recordingName) => {
  try {
    const response = await axiosInstance.get(`/api/video/recordings/download/${userSessionId}/recording/${recordingName}`, {
      responseType: 'blob'
    });
    console.log(`${APPLICATION_SERVER_URL}/api/video/recordings/download/${userSessionId}/recording/${recordingName}`)
    console.log(response)
    const url = window.URL.createObjectURL(new Blob([response.data]));
    console.log(url)
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${recordingName}`); // 파일명 설정
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error('Download failed:', error);
  }
};
