import create from 'zustand';
import { getTeacherInfo, TeacherInfo } from '../api/Info';

interface TeacherState {
  teacherInfo: TeacherInfo | null;
  setTeacherInfo: (info: TeacherInfo) => void; // Add setTeacherInfo
}

export const useTeacherInfoStore = create<TeacherState>((set) => ({
  teacherInfo: null,
  setTeacherInfo: (info: TeacherInfo) => set({ teacherInfo: info }), // Define setTeacherInfo
}));