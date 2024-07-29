import axiosInstance from './token/axiosInstance'

interface Diary{
    diaryId: number;
    createDate: string;
    content: string;
    images: string[];
}


// 특정 아이의 모든 성장일지 조회
export async function getKidAllGrowthDiarys(childId: number) {
    try {
      const response = await axiosInstance.get(`diary/child/${childId}`)
  
      if (response.data.status === 'success') {
        console.log(response.data.data) // 확인 후 삭제
        return response.data.data
      } else {
        throw new Error('Failed to get growth-diary')
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

// 성장일지 상세 조회
export async function getGrowthDiary(diaryId: number) {
  try  {
    const response = await axiosInstance.get(`diary/${diaryId}`)

    if (response.data.status === 'success') {
      console.log(response.data.data) // 확인 후 삭제
      return response.data.data
    } else {
      throw new Error('Failed to get growth-diary')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}
