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

// 녹화 시작 (세그먼트 녹화) - Chat GPT 추가
export const startSegmentRecording = async (sessionId: string): Promise<string> => {
  const url = `${APPLICATION_SERVER_URL}/api/video/sessions/${sessionId}/recordings/start`;
  
  try {
    const response = await axios.post(
      url,
      {
        outputMode: "COMPOSED",
        recordingMode: "ALWAYS",
        name: `segment-${Date.now()}`, // 세그먼트 파일명에 타임스탬프를 포함
        hasAudio: true,
        hasVideo: true,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data && typeof response.data === 'string') {
      return response.data;
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Network or server error when starting segment recording:", error.message);
    } else {
      console.error("Unexpected error when starting segment recording:", error);
    }
    throw error;
  }
};

// 녹화 중지 (세그먼트 녹화 중지) - Chat GPT 추가
export const stopSegmentRecording = async (recordingId: string): Promise<any> => {
  const url = `${APPLICATION_SERVER_URL}/api/video/recordings/stop/${recordingId}`;

  try {
    const response = await axios.post(
      url,
      {},
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data) {
      return response.data;
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Network or server error when stopping segment recording:", error.message);
    } else {
      console.error("Unexpected error when stopping segment recording:", error);
    }
    throw error;
  }
};

// 세그먼트 병합 요청 - Chat GPT 추가
const mergeSegments = async (segmentList: string[]): Promise<string> => {
  const url = `${APPLICATION_SERVER_URL}/api/video/recordings/save`;

  try {
    const response = await axios.post(
      url,
      segmentList, // 병합할 세그먼트 ID 리스트
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data && typeof response.data === 'string') {
      return response.data; // 병합된 파일의 경로 반환
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Network or server error when merging segments:", error.message);
    } else {
      console.error("Unexpected error when merging segments:", error);
    }
    throw error;
  }
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

// 욕설 감지
const detectProfanity = (text: string): boolean => {
  const profanityList = ["김범수", "바보"]; // Add more words as needed
  return profanityList.some((word) => text.includes(word));
};

// stt() 및 세그먼트 녹화 처리 - Chat GPT 추가
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

  const segmentList: string[] = []; // 세그먼트 리스트 - Chat GPT 추가

  recognition.onresult = async (event) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        const transcript = event.results[i][0].transcript;
        console.log(transcript);
        if (detectProfanity(transcript)) {
          console.log("Profanity detected. Starting recording...");
          alert("욕설이 감지되었습니다. 녹화가 시작됩니다."); // 알림창 추가 ----> ***************TODO : 수정필요*************
          
          const recordingId = await startSegmentRecording(sessionId); // 세그먼트 녹화 시작 - Chat GPT 추가
          segmentList.push(recordingId); // 세그먼트 리스트에 추가 - Chat GPT 추가
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

  // 주기적으로 세그먼트 녹화 중지 및 새 세그먼트 시작 - Chat GPT 추가
  setInterval(async () => {
    if (segmentList.length > 0) {
      const lastSegmentId = segmentList[segmentList.length - 1];
      await stopSegmentRecording(lastSegmentId); // 마지막 세그먼트 녹화 중지
    }

    const newRecordingId = await startSegmentRecording(sessionId); // 새로운 세그먼트 녹화 시작
    segmentList.push(newRecordingId); // 세그먼트 리스트에 추가
  }, 5000);

  // 세션 종료 시 세그먼트 병합 - Chat GPT 추가
  window.addEventListener('beforeunload', async () => {
    await mergeSegments(segmentList); // 세그먼트 병합
  });
};

// 녹화 중지 버튼 - 완전한 녹화 종료 및 세그먼트 병합 - Chat GPT 추가
export const stopRecording = async (sessionId: string, segmentList: string[], intervalIdRef: React.MutableRefObject<number | null>) => {
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

// 기존 기능은 그대로 유지 - Chat GPT 추가
export const stopSpeechRecognition = () => {
  const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (recognition) {
    recognition.stop();
  }
};
