import axios from 'axios'

interface Child {
  name: string;
  kindergartenClassName: string;
  kindergartenName: string;
  gender: string;
  birth: string;
}

interface ParentData {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  nickname: string;
  tel: string;
  child: Child;
}

const parentApi = {
  register: async (data: ParentData) => {
    const response = await axios.post('http://localhost:8080/api/parent', data, {
      headers: {
        'Accept': 'application/json',
      },
    });
    return response.data;
  }
};

export default parentApi;

