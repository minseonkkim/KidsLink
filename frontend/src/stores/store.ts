import create from 'zustand';

export interface UserState {  // UserState 인터페이스를 export
  userType: string;
  setUserType: (userType: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  userType: 'ROLE_TEACHER',
  setUserType: (userType) => set({ userType }),
}));
