import create from 'zustand';

interface UserState {
  accessToken: string;
  userId: string;
  role: string;
  setAccessToken: (token: string) => void;
  setUserId: (id: string) => void;
  setRole: (role: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  accessToken: '',
  userId: '',
  role: '',
  setAccessToken: (token) => set({ accessToken: token }),
  setUserId: (id) => set({ userId: id }),
  setRole: (role) => set({ role: role }),
}));
