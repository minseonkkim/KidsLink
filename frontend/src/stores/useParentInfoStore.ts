// 부모 정보 저장 - childId 이용
import create from 'zustand';
import { getParentInfo, ParentInfo } from '../api/Info'

interface ParentState {
  parentInfo: ParentInfo | null;
  fetchParentInfo: () => Promise<void>;
}

export const useParentInfoStore = create<ParentState>((set) => ({
  parentInfo: null,
  fetchParentInfo: async () => {
    try {
      const parentInfo = await getParentInfo();
      set({ parentInfo });
    } catch (error) {
      console.error('Failed to fetch parent-info:', error);
    }
  },
}))
