import create from 'zustand';

interface ChatRoomState {
  roomNo: number;
  name: string;
  sub: boolean;
  setRoom: (roomNo: number, name: string) => void;
  setSub: (sub: boolean) => void;
}

const useChatRoomStore = create<ChatRoomState>((set) => ({
  roomNo: -1,
  name: "",
  sub: false,
  setRoom: (roomNo, name) => set({ roomNo, name }),
  setSub: (sub) => set({ sub }),
}));

export default useChatRoomStore;
