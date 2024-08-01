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


// 전체 상담 가능날짜 조회
export async function getAllPossibleReservations(): Promise<Reservation[]> {
  try {
    const response = await axiosInstance.get('meeting')

    if (response.data.status === 'success') {
      console.log(response.data.data) // 확인 후 삭제
      return response.data.data
    } else {
      throw new Error('Failed to get reservations')
    }
  } catch (error) {
    console.error(error)
    throw error
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