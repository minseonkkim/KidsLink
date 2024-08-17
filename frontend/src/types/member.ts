
// 학부모 회원가입 데이터 형식
interface ChildData {
  name: string;
  kindergartenClassId: number;
  kindergartenId: number;
  gender: string;
  birth: string;
}

export interface ParentSignupData {
  username: string;
  name: string;
  password: string;
  passwordConfirm: string;
  email?: string;
  profile?: File;
  nickname?: string;
  tel?: string;
  child: ChildData;
  childProfile?: File;
}

// 로그인 데이터 형식
export interface LoginData {
  username: string;
  password: string;
}

// 선생님 회원가입 데이터 형식
export interface TeacherSignupData {
  username: string;
  name: string;
  password: string;
  passwordConfirm: string;
  kindergartenId: number;
  kindergartenClassId: number;
  email?: string;
  profile?: File;
  nickname?: string;
  tel?: string;
}