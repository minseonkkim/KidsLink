import axiosInstance from "./token/axiosInstance";

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



// 전체 상담 가능날짜 조회
export async function getAllPossibleReservations(): Promise<Reservation[]> {
  try {
    const response = await axiosInstance.get('meeting')

    if (response.data.status === 'success') {
      return response.data.data
    } else {
      throw new Error('Failed to get reservations')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function fetchSessionId(): Promise<SessionData> {
  try {
    const response = await axiosInstance.get('/meeting/reservation');
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch session data:", error);
    throw error;
  }
}

// 학부모 상담 예약 제출
export async function postAllPossibleReservations(selectedReservations: ParentReservation[]): Promise<ParentReservation[]> {
  console.log(selectedReservations)
  try {
    const response = await axiosInstance.post('meeting', selectedReservations)

    if (response.data.status === 'success') {
      console.log(response.data.data) // 확인 후 삭제
      return response.data.data
    } else {
      throw new Error('Failed to post reservations')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

// 교사 상담시간 오픈
export async function PostTeacherReservations(data: TeacherMeetingReservation[]) {
  console.log(data)
  try {
    const response = await axiosInstance.post('meeting/open', data)


    if (response.data.status === 'success') {
      console.log(response)
      console.log("response.data.data")
      console.log(response.data.data) // 확인 후 삭제
      return response.data.data
    } else {
      throw new Error('Failed to post reservations')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

//상담일자 확정하기
export async function ConfirmMeeting() {
  console.log("상담일자 확정하기")
  try {
    const response = await axiosInstance.post('meeting/confirm')
    if (response.data.status === 'success') {
      console.log(response.data)
      return response.data.data
    } else {
      throw new Error('Failed to confirmMeeting')
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function GetConfirmedMeeting(): Promise<ParentTeacherMeeting[]> {
  try {
    const response = await axiosInstance.get('/meeting/reservation');
    if (response.data.status === 'success') {
      return response.data.data as ParentTeacherMeeting[];
    } else {
      throw new Error('Failed to get confirmed meetings');
    }
  } catch (error) {
    console.error("Error fetching confirmed meetings:", error);
    throw error;
  }
}
