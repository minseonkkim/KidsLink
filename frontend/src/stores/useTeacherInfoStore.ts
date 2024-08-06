import create from 'zustand';
import { persist } from 'zustand/middleware';
import { TeacherInfo } from '../api/Info';

interface TeacherState {
  teacherInfo: TeacherInfo | null;
  setTeacherInfo: (info: TeacherInfo) => void;
}

const useTeacherInfoStore = create<TeacherState>()(
  persist(
    (set) => ({
      teacherInfo: null,
      setTeacherInfo: (info: TeacherInfo) => set({ teacherInfo: info }),
    }),
    {
      name: 'teacher-info', // The name of the key in local storage
      getStorage: () => localStorage, // Use local storage
    }
  )
);

export default useTeacherInfoStore;
