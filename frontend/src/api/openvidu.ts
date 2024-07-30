import axios from "axios";
import axiosInstance from "./token/axiosInstance";

const APPLICATION_SERVER_URL = "http://localhost:5000/api";
const OPENVIDU_SERVER_SECRET = "MY_SECRET";

export const getToken = async (mySessionId: string): Promise<string> => {
  console.log("getToken에서의 sessionId")
  const sessionId = await createSession(mySessionId);
  console.log("getToken에서의 sessionId 시작")
  console.log(sessionId)
  console.log("getToken에서의 sessionId 끝")
  return await createToken(sessionId);
};

const createSession = async (sessionId: string): Promise<string> => {
    console.log("createSession에서의 sessionId")
    console.log(sessionId)
    console.log("서버 주소")
    console.log(`${APPLICATION_SERVER_URL}/sessions`)
  const response = await axios.post(
    `${APPLICATION_SERVER_URL}/sessions`, { customSessionId: sessionId },
    {
      headers: {
        "Content-Type": "application/json",
      }
    }
  );
  console.log(response)
  console.log("세션 생성 응답:", response.data);
  return response.data; // 세션 ID 반환, data.id를 통해 올바른 값 추출
};

const createToken = async (sessionId: string): Promise<string> => {
  const response = await axios.post(
    `${APPLICATION_SERVER_URL}/sessions/${sessionId}/connections`,
    {},
    {
        headers: { 'Content-Type': 'application/json', },
    }
  );
  console.log("====response====")
  console.log(response)
  console.log("토큰 생성 응답:", response.data);
  return response.data; // 토큰 반환
};
