import create from 'zustand';

interface Notice {
  noticeBoardId: number;
  teacherName: string;
  title: string;
  content: string;
  noticeBaordDate: string;
}

interface NoticeState {
  notices: Notice[];
  setNotices: (notices: Notice[]) => void;
}

export const useNoticeStore = create<NoticeState>((set) => ({
  notices: [],
  setNotices: (notices) => set({ notices }),
}));
