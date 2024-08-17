import { create } from "zustand";
import { ParentInfo } from "../types/info"

interface ParentInfoState {
  parentInfo: ParentInfo | null;
  parentHasAccessedMeeting: boolean; // 사용자가 meeting에 접근했는지 여부를 저장
  setParentInfo: (info: ParentInfo) => void;
  setParentHasAccessedMeeting: (hasAccessed: boolean) => void; // 상태를 설정하는 함수
}

export const useParentInfoStore = create<ParentInfoState>((set) => ({
  parentInfo: null,
  parentHasAccessedMeeting: false, // 초기값은 false
  setParentInfo: (info) => set({ parentInfo: info }),
  setParentHasAccessedMeeting: (hasAccessed) =>
    set({ parentHasAccessedMeeting: hasAccessed }),
}));
