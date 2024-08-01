import axiosInstance from "./token/axiosInstance";

// 사진 분류하기
export async function createClassifyImages(classifyImages: string[]){
  try {
    const formData = new FormData();
    
    classifyImages.forEach((image, index) => {
      formData.append('request', image); // 'request'라는 이름으로 각 파일을 추가
    });

    const response = await axiosInstance.post('album/classify', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log(response);
  } catch (error) {
    console.error(error);
    throw error;
  }
}


// 특정 아이의 모든 앨범 조회
export async function getKidAllAlbums(childId: number) {
  try {
    const response = await axiosInstance.get(`album/child/${childId}`)

    if (response.data.status === 'success') {
      console.log(response.data.data) // 확인 후 삭제
      return response.data.data
    } else {
      throw new Error('Failed to get albums')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

// 특정 아이의 특정 앨범 조회
export async function getKidAlbum(albumId: number) {
  try {
    const response = await axiosInstance.get(`album/${albumId}`)

    if (response.data.status === 'success') {
      console.log(response.data.data) // 확인 후 삭제
      return response.data.data
    } else {
      throw new Error('Failed to get album')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}
