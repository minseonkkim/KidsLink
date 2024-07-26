import axiosInstance, { setAxiosInterceptors } from './axiosInstance';
import axios from 'axios';
import { useAppStore } from '../stores/store'

const BASE_URL = import.meta.env.VITE_API_KEY;

interface LoginData {
  username: string;
  password: string;
}

interface ParentSignupData {
  username: string;
  name: string;
  password: string;
  passwordConfirm: string;
  email?: string;
  profile?: File;
  nickname?: string;
  tel?: string;
  child?: {
    name?: string;
    kindergartenClassName?: string;
    kindergartenName?: string;
    gender?: string;
    birth?: string;
  };
}

interface TeacherSignupData {
  username: string;
  name: string;
  password: string;
  passwordConfirm: string;
  kindergartenName: string;
  kindergartenClassName: string;
  email?: string;
  profile?: File;
  nickname?: string;
  tel?: string;
}

// 토큰 만료 확인 및 재발급 함수
const fetchAccessToken = async (): Promise<string | undefined> => {
  const accessToken: string | null = localStorage.getItem('accessToken');
  const expiredAt: string | null = localStorage.getItem('expiredAt');
  const refreshToken: string | null = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    return;
  }

  if (accessToken != null && expiredAt != null) {    const nowDate: number = new Date().getTime();

    if (parseInt(expiredAt) < nowDate) {
      try {
        const { data } = await axios({
          url: `${BASE_URL}/reissue`,
          method: 'POST',
          headers: {
            'x-refresh-token': refreshToken,
          },
        });

        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('expiredAt', data.data.expiredAt.toString());
        return data.data.accessToken;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Failed to refresh access token:', error.response?.data);
        } else {
          console.error('Unexpected error:', error);
        }
        return;
      }
    } else {
      return accessToken;
    }
  } else {
    return;
  }
}

// 로그인 함수
export async function login(user: LoginData) {
  const setUserType = useAppStore.getState().setUserType;

  try {
    const response = await axiosInstance.post('/user/login', user, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.status === "success") {
      const { token, expiredAt, role, refreshToken } = response.data.data;
      localStorage.setItem('accessToken', token);
      localStorage.setItem('expiredAt', expiredAt.toString());
      localStorage.setItem('refreshToken', refreshToken);
      setUserType(role);

      // 로그인 성공 후 인터셉터 설정
      setAxiosInterceptors(fetchAccessToken);

      console.log("Login successful:", response.data.data);
      return response.data.data;
    } else {
      throw new Error('Login failed: ' + response.data.message);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.toJSON());
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}

// 학부모 회원가입 함수
export async function parentSignup(user: ParentSignupData) {
  const formData = new FormData();
  formData.append('username', user.username);
  formData.append('email', user.email || '');
  formData.append('password', user.password);
  formData.append('passwordConfirm', user.passwordConfirm);
  formData.append('name', user.name);
  formData.append('nickname', user.nickname || user.name);
  formData.append('tel', user.tel || '');
  if (user.child) {
    formData.append('child.name', user.child.name || '');
    formData.append('child.kindergartenClassName', user.child.kindergartenClassName || '');
    formData.append('child.kindergartenName', user.child.kindergartenName || '');
    formData.append('child.gender', user.child.gender || '');
    formData.append('child.birth', user.child.birth || '');
  }
  if (user.profile) {
    formData.append('profile', user.profile);
  }

  try {
    const response = await axiosInstance.post(`/parent`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(user)
    console.log("Parent signup successful:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error signing up parent:', error);
    throw error;
  }
}

// 선생님 회원가입 함수
export async function teacherSignup(user: TeacherSignupData) {
  const formData = new FormData();
  formData.append('username', user.username);
  formData.append('email', user.email || '');
  formData.append('password', user.password);
  formData.append('passwordConfirm', user.passwordConfirm);
  formData.append('name', user.name);
  formData.append('nickname', user.nickname || user.name);
  formData.append('tel', user.tel || '');
  formData.append('kindergartenName', user.kindergartenName);
  formData.append('kindergartenClassName', user.kindergartenClassName);
  if (user.profile) {
    formData.append('profile', user.profile);
  }

  try {
    const response = await axiosInstance.post(`/teacher`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log("Teacher signup successful:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error signing up teacher:', error);
    throw error;
  }
}

// 아이디 중복 검사 함수
export async function checkUsernameExists(username: string): Promise<boolean> {
  try {
    const response = await axiosInstance.post('/user/exists', { username }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.status === "success") {
      return response.data.data;
    } else {
      throw new Error('Failed to check username: ' + response.data.message);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.toJSON());
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}
