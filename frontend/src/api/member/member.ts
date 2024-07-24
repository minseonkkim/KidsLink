import axiosInstance from './axiosInstance'; // Axios 인스턴스 import
import axios from 'axios'

const BASE_URL = 'http://localhost:8080/api';

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
export const fetchAccessToken = async (): Promise<string | undefined> => {
  const accessToken: string | null = localStorage.getItem('accessToken');
  const expiredAt: string | null = localStorage.getItem('expiredAt');

  if (accessToken != null && expiredAt != null) {
    const nowDate: number = new Date().getTime();

    // 토큰 만료시간이 지났다면
    if (parseInt(expiredAt) < nowDate) {
      try {
        // 리프레쉬 토큰 발급 서버 요청
        const { data } = await axios({
          url: `${BASE_URL}/reissue`,
          method: 'POST',
          headers: {
            'x-refresh-token': localStorage.getItem('refreshToken') || '',
          },
        });

        // 엑세스 토큰 갱신 후 로컬 스토리지에 저장
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
      // 유효기간이 남아 있을 때
      return accessToken;
    }
  } else {
    // 토큰 또는 만료 시간이 null일 때
    return;
  }
}


// 로그인 함수
export async function login(user: LoginData) {
  console.log("Attempting to login with:", user.username); // 민감한 정보를 포함하지 않도록 수정
  try {
    const response = await axiosInstance.post(`/user/login`, user, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.status === "success") {
      const { token, expiredAt } = response.data.data;
      localStorage.setItem('accessToken', token);
      localStorage.setItem('expiredAt', expiredAt.toString());
      console.log("Login successful:", response.data.data); // 로그인 성공 정보만 출력
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
  console.log("user: ", user)
  const formData = new FormData();
  formData.append('username', user.username);
  formData.append('email', user.email || '');
  formData.append('password', user.password);
  formData.append('passwordConfirm', user.passwordConfirm);
  formData.append('name', user.name);
  formData.append('nickname', user.nickname || user.name); // nickname이 없으면 name으로 설정
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
    console.log("Parent signup successful:", response.data); // 회원가입 성공 정보만 출력
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
  formData.append('nickname', user.nickname || user.name); // nickname이 없으면 name으로 설정
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
    console.log("Teacher signup successful:", response.data); // 회원가입 성공 정보만 출력
    return response.data;
  } catch (error) {
    console.error('Error signing up teacher:', error);
    throw error;
  }
}
