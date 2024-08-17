import axiosInstance from './token/axiosInstance'
import { ParentSchedules, TeacherSchedules, NewSchedule } from "../types/schedule"


// 부모 일정 전체 조회 함수
export async function getAllParentSchedules(year: number, month: number): Promise<string[]> {
  try {
    const response = await axiosInstance.get<{ data: string[] }>(`schedule/parent?year=${year}&month=${month}`);
    if (response.data) {
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