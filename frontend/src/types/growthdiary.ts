
export interface Diary {
  content: string;
  createDate: string;
  diaryId: number;
  images: string[];
  teacherName: string;
  thumbnail: string;
}

export interface DiaryDetail {
  diaryId: number;
  createDate: string;
  content: string;
  images: { imageId: number; path: string }[];
  teacherName: string;
}

export interface DiaryData {
  diaryDate: string;
  content: string;
  files: string[]; 
}

export interface FormDiaryData {
  diaryDate: string;
  content: string;
  files: File[]; 
}