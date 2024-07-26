import create from 'zustand';

// AuthState interface and state
interface AuthState {
  username: string;
  password: string;
  isLoggedIn: boolean;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  login: () => void;
  logout: () => void;
}

// UserState interface and state
interface UserState {
  userType: string;
  setUserType: (userType: string) => void;
}

// ParentInfoState interface and state
interface ParentInfoState {
  email: string;
  name: string;
  nickname: string;
  tel: string;
  passwordConfirm: string;
  profile: File | undefined;
  setEmail: (email: string) => void;
  setName: (name: string) => void;
  setNickname: (nickname: string) => void;
  setTel: (tel: string) => void;
  setPasswordConfirm: (passwordConfirm: string) => void;
  setProfile: (profile: File | undefined) => void;
}

// ChildInfoState interface and state
interface ChildInfoState {
  gender: string | undefined;
  childName: string;
  birth: string;
  kindergartenName: string;
  className: string;
  setGender: (gender: string) => void;
  setChildName: (childName: string) => void;
  setBirth: (birth: string) => void;
  setKindergartenName: (kindergartenName: string) => void;
  setClassName: (className: string) => void;
}

// Unified AppState interface
interface AppState extends AuthState, UserState, ParentInfoState, ChildInfoState {}

export const useAppStore = create<AppState>((set) => ({
  // AuthState initial values and methods
  username: '',
  password: '',
  isLoggedIn: false,
  setUsername: (username) => set(() => ({ username })),
  setPassword: (password) => set(() => ({ password })),
  login: () => set(() => ({ isLoggedIn: true })),
  logout: () => set(() => ({ isLoggedIn: false, username: '', password: '' })),

  // UserState initial values and methods
  userType: '',
  setUserType: (userType) => set(() => ({ userType })),

  // ParentInfoState initial values and methods
  email: '',
  name: '',
  nickname: '',
  tel: '',
  passwordConfirm: '',
  profile: undefined,
  setEmail: (email) => set(() => ({ email })),
  setName: (name) => set(() => ({ name })),
  setNickname: (nickname) => set(() => ({ nickname })),
  setTel: (tel) => set(() => ({ tel })),
  setPasswordConfirm: (passwordConfirm) => set(() => ({ passwordConfirm })),
  setProfile: (profile) => set(() => ({ profile })),

  // ChildInfoState initial values and methods
  gender: undefined,
  childName: '',
  birth: '',
  kindergartenName: '',
  className: '',
  setGender: (gender) => set(() => ({ gender })),
  setChildName: (childName) => set(() => ({ childName })),
  setBirth: (birth) => set(() => ({ birth })),
  setKindergartenName: (kindergartenName) => set(() => ({ kindergartenName })),
  setClassName: (className) => set(() => ({ className })),
}));
