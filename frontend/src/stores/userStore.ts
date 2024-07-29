import create from 'zustand';

interface UserState {
    accessToken: string;
    setAccessToken: (token: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
    accessToken: '',
    setAccessToken: (token) => set({ accessToken: token }),
}));