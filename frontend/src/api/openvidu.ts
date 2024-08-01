import axios from "axios";

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
