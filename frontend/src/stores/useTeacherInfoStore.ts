import { create } from 'zustand';
import { TeacherInfo } from '../api/Info';

interface TeacherState {
  teacherInfo: TeacherInfo | null;
  setTeacherInfo: (info: TeacherInfo) => void;
}

export const useTeacherInfoStore = create<TeacherState>((set) => ({
  teacherInfo: null,
  setTeacherInfo: (info) => set({ teacherInfo: info }),
}))