export interface Reservation {
    meetingId: number;
    date: string;
    time: string;
  }
  
  export interface ParentReservation {
    meetingDate: string;
    meetingTime: string;
  }
  
  export interface TeacherMeetingReservation {
    date: string;
    times: string[];
  }
  
  export interface SessionData {
    id: number;
  }
  
  export interface ParentTeacherMeeting {
    meetingId: number;
    meetingDate: string;
    meetingTime: string;
    parentId: number;
    teacherId: number;
  }
  
  export interface MeetingInfo {
    id: number;
    date: string;
    time: string;
    teacherId: number;
    teacherName: string;
    parentId: number;
    childName: string;
  }
  
  export interface TeacherMeetingScheduleProps {
    date: string;
    time: string;
    name: string;
    profileImgPath: string;
    isActivate: boolean;
  }