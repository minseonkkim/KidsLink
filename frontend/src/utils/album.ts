import { createClassifyImages } from "../api/album";
import { AlbumItem } from "../types/album";
import { ChangeEvent } from 'react';


//주어진 앨범 데이터를 변환하여 자식 ID와 사진 ID 목록을 포함하는 객체 배열로 반환하는 함수
export const transformData = (result: AlbumItem[]) => {
  return result
    .filter((item) => item.child !== null)
    .map((item) => ({
      childId: item.child!.childId,
      photos: item.images.map((image) => image.imageId),
    }));
};


//이미지 파일을 업로드하고 상태를 업데이트하는 함수
export const handleImageUpload = (event: ChangeEvent<HTMLInputElement>, setImages: React.Dispatch<React.SetStateAction<File[]>>) => {
  const files = Array.from(event.target.files || []);
  setImages(prevImages => [...prevImages, ...files]);
};

//지정한 인덱스의 이미지를 삭제하고 상태를 업데이트하는 함수
export const handleDeleteImage = (index: number, setImages: React.Dispatch<React.SetStateAction<File[]>>) => {
  setImages(prevImages => prevImages.filter((_, i) => i !== index));
};


 //이미지를 분류하고 결과를 네비게이션 상태로 전달하는 비동기 함수
export const handleClassify = async (
  images: File[], 
  setLoading: React.Dispatch<React.SetStateAction<boolean>>, 
  navigate: (path: string, state?: any) => void
) => {
  setLoading(true);
  try {
    const result = await createClassifyImages(images);
    const sortedResult = result.reverse();
    navigate('/album/classify_finish', { state: { sortedResult } });
  } catch (error) {
    console.error("Error classifying images:", error);
  } finally {
    setLoading(false);
  }
};
