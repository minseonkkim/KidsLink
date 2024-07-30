import create from 'zustand';

interface TeacherState {
  teacherId: number;
  setTeacherId: (teacherId: number) => void;
}

const useTeacherStore = create<TeacherState>((set) => ({
  teacherId: 0,
  setTeacherId: (teacherId) => set({ teacherId }),
}));

export default useTeacherStore;
