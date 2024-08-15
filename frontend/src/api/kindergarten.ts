import axiosInstance from './token/axiosInstance';
import noAuthAxios from './token/noAuthAxios'

interface Kindergarten {
  kindergartenId: number;
  kindergartenName: string;
}

interface KindergartenClass {
  kindergartenClassId: number;
  kindergartenClassName: string;
}

interface Child{
  childId: number;
  name: string;
  kindergartenClassName: string;
  kindergartenName: string;
  gender: string;
  birth: string;
  profile: string;
}

// 모든 유치원 조회
export async function getAllKindergartens(): Promise<Kindergarten[]> {
  try {
    const response = await noAuthAxios.get('/kindergarten')
    return response.data.data;
  } catch (error) {
    console.error(error)
    throw error;
  }
}

// 특정 유치원의 반 조회
export async function getKindergartenClasses(kindergartenId: number): Promise<KindergartenClass[]> {
  try {
    const response = await noAuthAxios.get(`/kindergarten/${kindergartenId}`)
    return response.data.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

// 반 아이들 조회
export async function getClassChilds(classId: number): Promise<Child[]> {
  try {
    const response = await axiosInstance.get(`/kindergarten/class/${classId}`)
    return response.data.data.children
  } catch (error) {
    console.error(error)
    throw error
  }
}


