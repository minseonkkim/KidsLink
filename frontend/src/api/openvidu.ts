import axios from 'axios';

const APPLICATION_SERVER_URL = import.meta.env.VITE_OPENVIDU_URL

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
  const response = await axios.post(
    `${APPLICATION_SERVER_URL}/sessions/${sessionId}/connections`,
    {},
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
  return response.data; // 토큰 반환
};

// Start recording a session
const startRecording = async (sessionId: string): Promise<string> => {
  const response = await axios.post(
    `${APPLICATION_SERVER_URL}/sessions/${sessionId}/recordings/start`,
    {},
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
  return response.data;
};

// Example function to detect profanity (simplified)
const detectProfanity = (text: string): boolean => {
  const profanityList = ['김범수', 'hi']; // Add more words as needed
  return profanityList.some(word => text.includes(word));
};

// Speech recognition and profanity detection
export const handleSpeechRecognition = async (sessionId: string) => {
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
        }
      }
    }
  };

  recognition.start();
};