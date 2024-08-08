// 토큰 필요한 함수인 경우
import noAuthAxios from "./noAuthAxios";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_KEY;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 토큰 설정 및 재발급 함수
const setAuthorizationToken = async () => {
  try {
    const response = await noAuthAxios.post(`${BASE_URL}/reissue`);
    const newToken = response.data.data.token;
    const expiredAt = response.data.data.expiredAt;

    localStorage.setItem("accessToken", newToken);
    localStorage.setItem("expiredAt", expiredAt.toString());
  } catch (error) {
    console.error("Failed to get access token:", error);
  }
};

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("accessToken");
    const expiredAt = localStorage.getItem("expiredAt");

    if (token && expiredAt) {
      const now = new Date().getTime();
      if (now < parseInt(expiredAt)) {
        config.headers["Authorization"] = `Bearer ${token}`;
      } else {
        // 토큰 만료 시 재발급
        await setAuthorizationToken();
        const newToken = localStorage.getItem("accessToken");
        if (newToken) {
          config.headers["Authorization"] = `Bearer ${newToken}`;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance
export { setAuthorizationToken }
