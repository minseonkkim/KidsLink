import axiosInstance from './token/axiosInstance'

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

interface TeacherPersonalSchedule {
  id: number;
  content: string;
  confirmationStatus: string;
}

interface TeacherSchedules{
  kindergartenSchedules: KindergartenSchedule[],
  teacherSchedules: TeacherPersonalSchedule[];
  meetingSchedules: MeetingSchedule[];
}

interface NewSchedule{
  date: string;
  content: string;
}

// 부모 일정 전체 조회 함수
export async function getAllParentSchedules(year: number, month: number): Promise<string[]> {
  try {
    const response = await axiosInstance.get<{ data: string[] }>(`schedule/parent?year=${year}&month=${month}`);
    if (response.data) {
      console.log("학부모 전체 일정: ", response.data.data)
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
      console.log(response.data.data)
      return response.data.data;
    } else {
      throw new Error('Failed to fetch schedule');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch schedule');
  }
}

// 선생님 일자별 일정 조회 함수
export async function getTeacherSchedules(date: string): Promise<TeacherSchedules> {
  try{
    const response = await axiosInstance.get(`schedule/teacher?date=${date}`);
    if (response.data.status === "success") {
      return response.data.data;
    } else {
      throw new Error('Failed to fetch schedule');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch schedule');
  }
}

// 선생님 일정 등록 함수
export async function createTeacherSchedule(newSchedule: NewSchedule){
  try{
    const response = await axiosInstance.post('schedule/teacher', newSchedule);
    if (response.data.status === "success") {
      return response.data.data;
    } else {
      throw new Error('Failed to fetch schedule');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch schedule');
  }
}

// 선생님 일정 완료 체크 함수
export async function createTeacherScheduleCheck(teacherScheduleId: number){
  try{
    const response = await axiosInstance.post(`schedule/teacher/${teacherScheduleId}/check`);
    if(response.data.status === "success"){
      return response.data.data;
    } else{
      throw new Error('Failed to fetch schedule check');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch schedule check');
  }
}

// 선생님 일정 삭제 함수
export async function deleteTeacherSchedule(teacherScheduleId: number){
  try{
    const response = await axiosInstance.delete(`schedule/teacher/${teacherScheduleId}`);
    if(response.data.status === "success"){
      return response.data.data;
    } else{
      throw new Error('Failed to fetch schedule check');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch schedule delete');
  }
}