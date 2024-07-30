import axiosInstance from './token/axiosInstance';

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

interface ParentSchedules {
  date: string;
  kindergartenSchedules: KindergartenSchedule[];
  meetingSchedules: MeetingSchedule[];
  absentSchedules: AbsentSchedule[];
  dosageSchedules: DosageSchedule[];
}

// 부모 일정 전체 조회 함수
export async function getAllParentSchedules(year: number, month: number): Promise<string[]> {
  try {
    const response = await axiosInstance.get<{ data: string[] }>(`schedule/parent?year=${year}&month=${month}`);
    if (response.data) {
      console.log(response.data.data); // 확인 후 삭제
      return response.data.data;
    } else {
      throw new Error('Failed to fetch schedules');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// 부모 세부 일정 조회 함수
export async function getParentSchedules(date: string): Promise<ParentSchedules> {
  try {
    const response = await axiosInstance.get<{ data: ParentSchedules }>(`schedule/parent/detail?date=${date}`);
    if (response.data) {
      console.log(response.data.data); // 확인 후 삭제
      return response.data.data;
    } else {
      throw new Error('Failed to fetch schedule');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch schedule');
  }
}
