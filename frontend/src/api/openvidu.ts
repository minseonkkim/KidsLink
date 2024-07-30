import axios from "axios";
import axiosInstance from "./token/axiosInstance";

const APPLICATION_SERVER_URL = "http://localhost:4443/api";

export const getToken = async (mySessionId: string): Promise<string> => {
    console.log("getToken에서의 sessionId")
  const sessionId = await createSession(mySessionId);
  console.log("getToken에서의 sessionId")
  console.log(sessionId)
  return await createToken(sessionId);
};

const createSession = async (sessionId: string): Promise<string> => {
    console.log("createSession에서의 sessionId")
    console.log(sessionId)
  const response = await axiosInstance.post(
    `${APPLICATION_SERVER_URL}/sessions`,
    { customSessionId: sessionId },
    {
        headers: { 'Content-Type': 'application/json', },
    }
  );
  console.log(response)
  console.log("세션 생성 응답:", response.data);
  return response.data.id; // 세션 ID 반환, data.id를 통해 올바른 값 추출
};

const createToken = async (sessionId: string): Promise<string> => {
  const response = await axios.post(
    `${APPLICATION_SERVER_URL}/sessions/${sessionId}/connections`,
    {},
    {
        headers: { 'Content-Type': 'application/json', },
    }
  );
  console.log("토큰 생성 응답:", response.data);
  return response.data.token; // 토큰 반환
};
