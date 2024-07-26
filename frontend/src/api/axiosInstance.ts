import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_KEY;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export const setAxiosInterceptors = (fetchAccessToken: () => Promise<string | undefined>) => {
  axiosInstance.interceptors.request.use(
    async (config) => {
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
};

export default axiosInstance;
