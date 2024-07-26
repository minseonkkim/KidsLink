import noAuthAxios from './token/noAuthAxios'

interface Kindergarten {
  kindergartenId: number;
  kindergartenName: string;
}

interface KindergartenClass {
  kindergartenClassId: number;
  kindergartenClassName: string;
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

