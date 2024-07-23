import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

interface ParentSignupData {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  nickname: string;
  tel: string;
  child: {
    name: string;
    kindergartenClassName: string;
    kindergartenName: string;
    gender: string;
    birth: string;
  };
}

interface TeacherSignupData {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  nickname: string;
  tel: string;
  kindergartenName: string;
  kindergartenClassName: string;
}

// 학부모 회원가입
export function parentSignup(user: ParentSignupData) {
  return axios({
    method: 'POST',
    url: `${BASE_URL}/parent`,
    headers: {
      'Accept': 'application/json',
    },
    data: user
  })
  .then(response => {
    console.log("Parent signed up successfully:", response.data);
    return response.data;
  })
  .catch(error => {
    console.error("Error signing up parent:", error);
    throw error;
  });
}

// 선생님 회원가입
export function teacherSignup(user: TeacherSignupData) {
  return axios({
    method: 'POST',
    url: `${BASE_URL}/teacher`,
    headers: {
      'Accept': 'application/json',
    },
    data: user
  })
  .then(response => {
    console.log("Teacher signed up successfully:", response.data);
    return response.data;
  })
  .catch(error => {
    console.error("Error signing up teacher:", error);
    throw error;
  });
}
