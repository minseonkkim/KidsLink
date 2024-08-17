export interface Kindergarten {
  kindergartenId: number;
  kindergartenName: string;
}

export interface KindergartenClass {
  kindergartenClassId: number;
  kindergartenClassName: string;
}

export interface Child{
  childId: number;
  name: string;
  kindergartenClassName: string;
  kindergartenName: string;
  gender: string;
  birth: string;
  profile: string;
}