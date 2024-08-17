
interface KindergartenSchedule {
  id: number;
  content: string;
  date: string;
}

interface MeetingSchedule {
  meetingId: number;
  meetingDate: string;
  meetingTime: string;
  parentId: number;
  teacherId: number;
}

interface AbsentSchedule {
  absentId: number;
  startDate: string;
  endDate: string;
  reason: string;
  details: string;
  confirmationStatus: string;
  childId: number;
  childName: string;
}

interface DosageSchedule {
  dosageId: number;
  startDate: string;
  endDate: string;
  name: string;
  volume: string;
  num: string;
  times: string;
  storageInfo: string;
  details: string;
  confirmationStatus: string;
  childId: number;
  childName: string;
}

export interface ParentSchedules {
  date: string;
  kindergartenSchedules: KindergartenSchedule[];
  meetingSchedules: MeetingSchedule[];
  absentSchedules: AbsentSchedule[];
  dosageSchedules: DosageSchedule[];
}

interface TeacherPersonalSchedule {
  id: number;
  content: string;
  confirmationStatus: string;
}

export interface TeacherSchedules{
  kindergartenSchedules: KindergartenSchedule[],
  teacherSchedules: TeacherPersonalSchedule[];
  meetingSchedules: MeetingSchedule[];
}

export interface NewSchedule{
  date: string;
  content: string;
}
