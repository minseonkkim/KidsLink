import axios from "axios";
import { fetchAccessToken } from "./member";

const BASE_URL = "http://localhost:8080/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    // 토큰 재발급 요청인 경우 인터셉터 무시
    if (config.url !== `${BASE_URL}/reissue`) {
      const token = await fetchAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

