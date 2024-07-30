import axiosInstance from './token/axiosInstance';

// 인터페이스 정의
export interface ChildInfo {
  birth: string;
  childId: number;
  childProfile: string | null;
  gender: string;
  kindergartenClassName: string;
  kindergartenName: string;
  name: string;
  profile: string | null;
}

export interface ParentInfo {
  email: string;
  name: string;
  nickname: string;
  profile: string | null;
  tel: string;
  username: string;
  child: ChildInfo;
}


export interface TeacherInfo {
  username: string;
  email: string | null;
  name: string;
  nickname: string;
  tel: string | null;
  kindergartenId: number;
  kindergartenClassId: number;
}


// 부모 정보 조회 함수
export async function getParentInfo(): Promise<ParentInfo> {
  try {
    const response = await axiosInstance.get('/parent');

    if (response.data.status === 'success') {
      console.log(response.data.data) // 확인 후 삭제
      return response.data.data
    } else {
      throw new Error('Failed to fetch parent-info')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

// 선생님 정보 조회 함수
export async function getTeacherInfo(): Promise<TeacherInfo> {
  try {
    const response = await axiosInstance.get('/teacher');

    if (response.data.status === 'success') {
      console.log(response.data.data) // 확인 후 삭제
      return response.data.data
    } else {
      throw new Error('Failed to fetch parent-info')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}
