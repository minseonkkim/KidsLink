import axiosInstance from './token/axiosInstance'
import { FormDiaryData } from '../types/growthdiary'


// 아이별 성장일지 목록 조회
export async function getKidAllGrowthDiarys(childId: number) {
  try {
    const response = await axiosInstance.get(`diary/child/${childId}`)

    if (response.data.status === 'success') {
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
      return response.data.data
    } else {
      throw new Error('Failed to get growth-diary')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

// 성장일지 작성
export async function createDiary(childId: number, diary: FormDiaryData) {
  const formData = new FormData();
  formData.append('diaryDate', diary.diaryDate);
  formData.append('content', diary.content);
  diary.files.forEach((file) => {
    formData.append('files', file); 
  });

  try {
    const response = await axiosInstance.post(`diary/child/${childId}`, diary, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
 

    if (response.data.status === "success") {
    } else {
      throw new Error("create diary failed: " + response.data.message);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}