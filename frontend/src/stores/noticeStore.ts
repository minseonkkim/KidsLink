import { create } from 'zustand';
import { getAllNotices } from '../api/notice'

interface Notice {
  noticeBoardId: number;
  teacherName: string;
  title: string;
  content: string;
  noticeBoardDate: string;
}

interface NoticeState {
  notices: Notice[];
  filteredNotices: Notice[];
  searchTitle: string;
  setNotices: (notices: Notice[]) => void;
  setSearchTitle: (title: string) => void;
  filterNotices: () => void;
  loadNotices: () => Promise<void>;
}

export const useNoticeStore = create<NoticeState>((set, get) => ({
  notices: [],
  filteredNotices: [],
  searchTitle: '',
  setNotices: (notices) => set({ notices, filteredNotices: notices }),
  setSearchTitle: (title) => set({ searchTitle: title }),
  filterNotices: () => {
    const { notices, searchTitle } = get();
    const filtered = notices.filter(notice =>
      notice.title.toLowerCase().includes(searchTitle.toLowerCase())
    );
    set({ filteredNotices: filtered });
  },
  loadNotices: async () => {
    try {
      const notices = await getAllNotices();
      set({ notices, filteredNotices: notices });
    } catch (error) {
      console.error('Error loading notices:', error);
    }
  }
}));
