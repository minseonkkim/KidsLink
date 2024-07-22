import create from 'zustand';

interface Notice {
  id: number;
  date: string;
  title: string;
}

interface NoticeStore {
  notices: Notice[];
  filteredNotices: Notice[];
  searchTitle: string;
  setNotices: (notices: Notice[]) => void;
  setSearchTitle: (title: string) => void;
  filterNotices: () => void;
}

const initialNotices: Notice[] = [
  {
    id: 1,
    date: "2024-07-15",
    title: "딸기농장 현장실습",
  },
  {
    id: 2,
    date: "2024-07-12",
    title: "전통 놀이의 날",
  },
  {
    id: 3,
    date: "2024-07-11",
    title: "공원에서의 자연 놀이",
  },
  {
    id: 4,
    date: "2024-07-09",
    title: "씨앗 심기 체험",
  },
  {
    id: 5,
    date: "2024-07-08",
    title: "음악 공연",
  },
  // 다른 알림 데이터 추가
];

export const useNoticeStore = create<NoticeStore>((set, get) => ({
  notices: initialNotices,
  filteredNotices: initialNotices,
  searchTitle: "",
  setNotices: (notices) => set({ notices, filteredNotices: notices }),
  setSearchTitle: (searchTitle) => set({ searchTitle }),
  filterNotices: () => {
    const { notices, searchTitle } = get();
    const filtered = notices.filter((notice) => 
      notice.title.toLowerCase().includes(searchTitle.toLowerCase())
    );
    set({ filteredNotices: filtered });
  },
}));
