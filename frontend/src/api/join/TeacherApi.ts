import axios from 'axios';

interface TeacherData {
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

const teacherApi = {
  register: async (data: TeacherData) => {
    const response = await axios.post('http://localhost:8080/api/teacher', data);
    return response.data;
  }
};

export default teacherApi;
