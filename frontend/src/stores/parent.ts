import { create } from 'zustand';

interface ParentState {
  parentId: number;
  setParentId: (parentId: number) => void;
}

const useParentStore = create<ParentState>((set) => ({
  parentId: 0,
  setParentId: (parentId) => set({ parentId }),
}));

export default useParentStore;
