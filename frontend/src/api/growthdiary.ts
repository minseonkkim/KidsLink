import axiosInstance from './token/axiosInstance'

interface Diary{
    diaryId: number;
    createDate: string;
    content: string;
    images: string[];
}

interface DiaryData{
    diaryDate: string;
    files: string[];
    content: string;
}


// 아이별 성장일지 목록 조회
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

// 성장일지 작성
export async function createDiary(childId:number, diary: DiaryData){
  try{
    const response = await axiosInstance.post(`diary/child/${childId}`);

    if(response.data.status === "success"){
      console.log("create-diary success");
    } else{
      throw new Error("cereate-diary failed: " + response.data.message);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}