
interface Kindergarten {
  kindergartenId: number;
  kindergartenName: string;
}

interface KindergartenClass {
  kindergarten: Kindergarten;
  kindergartenClassId: number;
  kindergartenClassName: string;
}

export interface ChildInfo {
  birth: string;
  childId: number;
  childProfile: string | null;
  gender: string;
  kindergartenClass: KindergartenClass;
  name: string;
  profile: string | null;
}

export interface ParentInfo {
  email: string;
  name: string;
  nickname: string;
  profile: string | null;
  tel: string;
  username: string;
  child: ChildInfo;
}

export interface TeacherInfo {
  username: string;
  email: string | null;
  name: string;
  nickname: string;
  tel: string | null;
  kindergartenId: number;
  kindergartenName: string;
  kindergartenClassId: number;
  kindergartenClassName: string | null;
  profile: string | null;
}