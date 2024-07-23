import axios from "axios"

const BASE_URL = "http://localhost:8080/api"

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
  }
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


// 학부모 회원가입
export function parentSignup(user: ParentSignupData) {
  const formData = new FormData();
  formData.append('username', user.username)
  formData.append('email', user.email || '')
  formData.append('password', user.password)
  formData.append('passwordConfirm', user.passwordConfirm)
  formData.append('name', user.name)
  formData.append('nickname', user.nickname || user.name) // nickname이 없으면 name으로 설정
  formData.append('tel', user.tel || '')
  if (user.child) {
    formData.append('child.name', user.child.name || '')
    formData.append('child.kindergartenClassName', user.child.kindergartenClassName || '')
    formData.append('child.kindergartenName', user.child.kindergartenName || '')
    formData.append('child.gender', user.child.gender || '')
    formData.append('child.birth', user.child.birth || '')
  }
  if (user.profile) {
    formData.append('profile', user.profile)
  }

  return axios.post(`${BASE_URL}/parent`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  .then(response => {
    console.log("Parent signed up successfully:", response.data)
    return response.data
  })
  .catch(error => {
    console.error("Error signing up parent:", error)
    throw error
  });
}


// 선생님 회원가입
export function teacherSignup(user: TeacherSignupData) {
  const formData = new FormData()
  formData.append('username', user.username)
  formData.append('email', user.email || '')
  formData.append('password', user.password)
  formData.append('passwordConfirm', user.passwordConfirm)
  formData.append('name', user.name)
  formData.append('nickname', user.nickname || user.name) // nickname이 없으면 name으로 설정
  formData.append('tel', user.tel || '')
  formData.append('kindergartenName', user.kindergartenName)
  formData.append('kindergartenClassName', user.kindergartenClassName)
  if (user.profile) {
    formData.append('profile', user.profile)
  }

  return axios.post(`${BASE_URL}/teacher`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  .then(response => {
    console.log("Teacher signed up successfully:", response.data)
    return response.data
  })
  .catch(error => {
    console.error("Error signing up teacher:", error)
    throw error
  })
}
