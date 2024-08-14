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
  const sessionProperties = {
    customSessionId: sessionId, // 세션 ID를 고유 식별자로 설정
    mediaMode: "ROUTED", // 미디어를 서버를 통해 라우팅하도록 설정
    recordingMode: "ALWAYS", // 세션 시작 시 자동으로 녹화 시작
    defaultRecordingProperties: {
      name: sessionId, // 녹화 파일의 이름을 세션 ID로 설정
      hasAudio: true, // 오디오를 녹음
      hasVideo: true, // 비디오를 녹화
      // outputMode: "COMPOSED", // 단일 파일로 녹화
      outputMode: "INDIVIDUAL", // 단일 파일로 녹화
      recordingLayout: "BEST_FIT", // 비디오 레이아웃 유형
      resolution: "1280x720", // 비디오 해상도 설정
      frameRate: 25, // 프레임 속도 설정
      shmSize: 536870912 // Docker를 위한 공유 메모리 크기
    },
    allowTranscoding: false // 필요하지 않으면 트랜스코딩을 허용하지 않음
  };

  const response = await axios.post(
    `${APPLICATION_SERVER_URL}/sessions`,
    sessionProperties, // 세션 속성을 요청 본문에 포함하여 전송
    {
      headers: {
        "Content-Type": "application/json",
      },
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

// 욕설 감지
const detectProfanity = (text: string): boolean => {
  const profanityList = ["멍청", "바보"]; // 필요에 따라 단어 추가
  return profanityList.some((word) => text.includes(word));
};

// 녹화된 영상 가져오기
export const fetchRecordings = async (): Promise<any[]> => {
  try {
    const response = await axiosInstance.get(`${APPLICATION_SERVER_URL}/recordings`);
    console.log("fetchRecordings", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching recordings:", error);
    throw error;
  }
};

export const fetchRecordingsByTeacherId = async (teacherId: number): Promise<any[]> => {
  try {
    const response = await axiosInstance.get(
      `${APPLICATION_SERVER_URL}/teacher/${teacherId}/recordings`
    );
    console.log("fetchRecordingsTeacher", response)
    return response.data;
  } catch (error) {
    console.error("Error fetching recordings:", error);
    throw error;
  }
};


// 학부모 측 STT 감지 메서드 => 감지 시 선생님에게 신호
export const handleSpeechRecognitionSignalByParent = async (session) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.error("SpeechRecognition not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        const transcript = event.results[i][0].transcript;
        console.log("STT Result from Parent:", transcript);

        if (detectProfanity(transcript)) {
          console.log("Profanity detected by Parent.");

          // 욕설 감지 신호를 선생님 세션으로 전송
          session.signal({
            data: "startRecording",
            to: [], // 선생님에게 신호 전송
            type: "profanityDetected",
          });

          recognition.stop(); // STT 중지
        }
      }
    }
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);

    switch (event.error) {
      case "not-allowed":
        console.error("Microphone access was denied by the user.");
        break;
      case "network":
        console.error("Network error occurred during speech recognition.");
        break;
      case "aborted":
        console.error("Speech recognition aborted unexpectedly.");
        break;
      case "no-speech":
        console.error("No speech detected.");
        break;
      default:
        console.error("An unknown error occurred in speech recognition:", event.error);
    }
  };

  recognition.start();
};

// STT 처리 및 키워드 감지
export const handleSpeechRecognition = async (sessionId: string, setDetectedTime: (time: number) => void) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.error("SpeechRecognition not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        const transcript = event.results[i][0].transcript;
        console.log("STT Result:", transcript);

        if (detectProfanity(transcript)) {
          console.log("Profanity detected.");
          const detectedTime = Date.now();
          setDetectedTime(detectedTime); // 감지된 시간을 전달
          recognition.stop(); // STT 중지
        }
      }
    }
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };

  recognition.start();
};

// 메인 녹화 시작
export const startMainRecording = async (sessionId: string): Promise<string> => {
  try {
    const response = await axios.post(
      `${APPLICATION_SERVER_URL}/sessions/${sessionId}/recordings/start`,
      {
        outputMode: "COMPOSED",
        recordingMode: "ALWAYS",
        name: "recording-name",
        hasAudio: true,
        hasVideo: true,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log(`startMainRecording -> /sessions/${sessionId}/recordings/start -> response`, response);

    return response.data.recordingId; // 녹화 ID 반환
  } catch (error) {
    console.error("Error starting main recording:", error);
    throw error;
  }
};

// 메인 녹화 중지
export const stopMainRecording = async (recordingId: string, startTime: number): Promise<void> => {
  try {
    console.log("stopMainRecording : ", `${APPLICATION_SERVER_URL}/recordings/stop/${recordingId}`, { startTime }, { headers: { "Content-Type": "application/json" } });

    const response = await axios.post(`${APPLICATION_SERVER_URL}/recordings/stop/${recordingId}`, { startTime }, { headers: { "Content-Type": "application/json" } });
    return response.data;
  } catch (error) {
    console.error("Error stopping recording:", error);
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
