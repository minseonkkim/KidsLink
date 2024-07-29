import axios from 'axios';
import { access } from 'fs';

const OPENVIDU_SECRET = "MY_SECRET"

// Base URL for your backend server
const BASE_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  auth: {
    username: 'OPENVIDUAPP',
    password: OPENVIDU_SECRET,
  }
});

async function getLiveStartToken(data: { accessToken: string; roomId: string }): Promise<string> {
    // Create a new session
    const accessToken = localStorage.getItem('accessToken')
    const res = await axiosInstance.post('/sessions', {
        customSessionId: data.roomId,
        accessToken: accessToken
    });
    console.log(res)
    return res.data.accessToken;
}

async function getLiveJoinToken(data: { accessToken: string; roomId: string }): Promise<string> {
    // Create a connection for the existing session
    const accessToken = localStorage.getItem('accessToken')
    const res = await axiosInstance.post(`/sessions/${data.roomId}/connections`);
    console.log(res)
    return res.data;
}

export {
    getLiveStartToken,
    getLiveJoinToken,
};
