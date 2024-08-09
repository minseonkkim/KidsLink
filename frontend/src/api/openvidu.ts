import axios from "axios";
import axiosInstance from "./token/axiosInstance";

const APPLICATION_SERVER_URL = import.meta.env.VITE_OPENVIDU_URL;
const OPENVIDU_SERVER_SECRET = import.meta.env.VITE_OPENVIDU_SECRET;

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// 세션 생성
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
  return response.data; // 세션 ID 반환
};

// 토큰 생성
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

export const getToken = async (mySessionId: string): Promise<string> => {
  const sessionId = await createSession(mySessionId);
  return await createToken(sessionId);
};
// 세그먼트 녹화 시작
export const startSegmentRecording = async (sessionId: string): Promise<string> => {
  const url = `${APPLICATION_SERVER_URL}/api/video/sessions/${sessionId}/recordings/start`;
  
  try {
    const response = await axios.post(
      url,
      {
        outputMode: "COMPOSED",
        recordingMode: "ALWAYS",
        name: `segment-${Date.now()}`,
        hasAudio: true,
        hasVideo: true,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error) {
    console.error("Error starting segment recording:", error);
    throw error;
  }
};

// 세그먼트 녹화 중지
export const stopSegmentRecording = async (recordingId: string): Promise<void> => {
  const url = `${APPLICATION_SERVER_URL}/api/video/recordings/stop/${recordingId}`;

  try {
    await axios.post(url, {}, { headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error stopping segment recording:", error);
    throw error;
  }
};

// 세그먼트 병합
const mergeSegments = async (segmentList: string[]): Promise<string> => {
  const url = `${APPLICATION_SERVER_URL}/api/video/recordings/save`;

  try {
    const response = await axios.post(
      url,
      segmentList,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error) {
    console.error("Error merging segments:", error);
    throw error;
  }
};

// 욕설 감지
const detectProfanity = (text: string): boolean => {
  const profanityList = ["김범수", "바보"]; // 필요에 따라 단어 추가
  return profanityList.some((word) => text.includes(word));
};

// 녹화된 영상 가져오기
export const fetchRecordings = async (): Promise<any[]> => {
  try {
    const response = await axiosInstance.get(`${import.meta.env.VITE_OPENVIDU_URL}/recordings`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recordings:", error);
    throw error;
  }
};

// STT 및 세그먼트 녹화 처리
export const handleSpeechRecognition = async (
  sessionId: string,
  setRecordingId: React.Dispatch<React.SetStateAction<string | null>>,
  segmentList: React.MutableRefObject<string[]>,
  intervalIdRef: React.MutableRefObject<number | null>,
  startMainRecording: () => void
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
        console.log("STT Result:", transcript);
  
        if (detectProfanity(transcript)) {
          console.log("Profanity detected. Starting main recording...");
          await stopSegmentRecording(segmentList.current[segmentList.current.length - 1]);
          startMainRecording();
          recognition.stop(); // STT 중지
        }
      }
    }
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };

  recognition.start();

  // 주기적으로 세그먼트 녹화 중지 및 새 세그먼트 시작
  intervalIdRef.current = window.setInterval(async () => {
    const lastSegmentId = segmentList.current[segmentList.current.length - 1];
    await stopSegmentRecording(lastSegmentId);

    const newSegmentId = await startSegmentRecording(sessionId);
    segmentList.current.push(newSegmentId);
    setRecordingId(newSegmentId);
  }, 5000);
};

// 메인 녹화 시작
export const startMainRecording = async (sessionId: string): Promise<string> => {
  const url = `${APPLICATION_SERVER_URL}/api/video/sessions/${sessionId}/recordings/start`;

  try {
    const response = await axios.post(
      url,
      {
        outputMode: "COMPOSED",
        recordingMode: "ALWAYS",
        name: `main-${Date.now()}`,
        hasAudio: true,
        hasVideo: true,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error) {
    console.error("Error starting main recording:", error);
    throw error;
  }
};

// 메인 녹화 중지
export const stopMainRecording = async (recordingId: string): Promise<void> => {
  const url = `${APPLICATION_SERVER_URL}/api/video/recordings/stop/${recordingId}`;

  try {
    await axios.post(url, {}, { headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error stopping main recording:", error);
    throw error;
  }
};

// 녹화 중지 버튼 - 세그먼트 병합 및 녹화 중지
export const stopRecording = async (
  sessionId: string,
  segmentList: string[],
  intervalIdRef: React.MutableRefObject<number | null>
) => {
  try {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current); // 세그먼트 녹화 타이머 중지
    }

    for (const segmentId of segmentList) {
      await stopSegmentRecording(segmentId); // 모든 세그먼트 녹화 중지
    }

    const mergedFilePath = await mergeSegments(segmentList); // 세그먼트 병합
    console.log("Merged recording available at:", mergedFilePath);

    return mergedFilePath;
  } catch (error) {
    console.error("Error stopping and merging recordings:", error);
    throw error;
  }
};

export const handleDownload = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const contentDisposition = response.headers.get("Content-Disposition");
    const contentType = response.headers.get("Content-Type");
    const blob = await response.blob();

    let fileName = "download";
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (fileNameMatch.length > 1) {
        fileName = fileNameMatch[1];
      }
    } else if (contentType) {
      const extension = contentType.split("/")[1];
      fileName = `kidslink.${extension}`;
    }

    const link = document.createElement("a");
    const objectURL = URL.createObjectURL(blob);
    link.href = objectURL;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectURL);
  } catch (error) {
    console.error("Failed to download file:", error);
  }
  // window.location.href = url;
};

// // 기존 기능은 그대로 유지 - Chat GPT 추가
// export const stopSpeechRecognition = () => {
//   const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//   if (recognition) {
//     recognition.stop();
//   }
// };
