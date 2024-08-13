import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TeacherInfo } from '../api/Info';

interface TeacherState {
  teacherInfo: TeacherInfo | null;
  hasAccessedMeeting: boolean;
  setTeacherInfo: (info: TeacherInfo) => void;
  setHasAccessedMeeting: (hasAccessed: boolean) => void;
}

export const useTeacherInfoStore = create<TeacherState>()(
  persist(
    (set) => ({
      teacherInfo: null,
      hasAccessedMeeting: false,
      setTeacherInfo: (info) => set({ teacherInfo: info }),
      setHasAccessedMeeting: (hasAccessed) => set({ hasAccessedMeeting: hasAccessed }),
    }),
    {
      name: 'teacher-info-storage', // unique name for storage
      getStorage: () => localStorage, // use localStorage to persist data
    }
  )
);
