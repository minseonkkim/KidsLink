import axiosInstance from "./token/axiosInstance";

interface Image {
  imageId: number;
  path: string;
}

interface Album {
  childId: number;
  albumName: string;
  albumDate: string;
  images: Image[];
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
export async function getKidAlbum(childId: number, albumId: number) {
  
}
