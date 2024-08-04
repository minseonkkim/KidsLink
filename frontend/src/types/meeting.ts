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

export interface ControlState {
    video: boolean;
    mic: boolean;
    muted: boolean;
    volume: number;
  }
  
export interface TeacherMeetingFooterProps {
    control: ControlState;
    handleControl: (update: (prev: ControlState) => ControlState) => void;
    close: () => void;
    stopRecording: () => void; // 녹음 중지 함수 추가
    isRecording: boolean; // 현재 녹음 상태를 나타내는 프로퍼티 추가
  }