import { create } from "zustand";
import { TeacherInfo } from "../types/info";

interface TeacherState {
  teacherInfo: TeacherInfo | null;
  hasAccessedMeeting: boolean;
  setTeacherInfo: (info: TeacherInfo) => void;
  setHasAccessedMeeting: (hasAccessed: boolean) => void;
}

export const useTeacherInfoStore = create<TeacherState>((set) => ({
  teacherInfo: null,
  hasAccessedMeeting: false,
  setTeacherInfo: (info) => set({ teacherInfo: info }),
  setHasAccessedMeeting: (hasAccessed) =>
    set({ hasAccessedMeeting: hasAccessed }),
}));
