import create from 'zustand';
import { ParentInfo } from '../api/Info'


interface ParentInfoState {
  parentInfo: ParentInfo | null;
  setParentInfo: (info: ParentInfo) => void;
}

export const useParentInfoStore = create<ParentInfoState>((set) => ({
  parentInfo: null,
  setParentInfo: (info) => set({ parentInfo: info }),
}));
