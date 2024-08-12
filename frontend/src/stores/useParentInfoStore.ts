import { create } from 'zustand'
import { ParentInfo } from '../api/Info'

interface ParentInfoState {
  parentInfo: ParentInfo | null;
  hasAccessedMeeting: boolean; // 사용자가 meeting에 접근했는지 여부를 저장
  setParentInfo: (info: ParentInfo) => void;
  setHasAccessedMeeting: (hasAccessed: boolean) => void; // 상태를 설정하는 함수
}

export const useParentInfoStore = create<ParentInfoState>((set) => ({
  parentInfo: null,
  hasAccessedMeeting: false, // 초기값은 false
  setParentInfo: (info) => set({ parentInfo: info }),
  setHasAccessedMeeting: (hasAccessed) => set({ hasAccessedMeeting: hasAccessed }),
}))
