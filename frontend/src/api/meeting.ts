import axiosInstance from './token/axiosInstance'

export interface Reservation {
  meetingId: number;
  date: string;
  time: string;
}


// 학부모 상담 예약 리스트 조회
export async function getTeacherReservation(): Promise<Reservation[]> {
  try {
    const response = await axiosInstance.get('meeting/reservation')

    if (response.data.status === 'success') {
      console.log(response.data.data) // 확인 후 삭제
      return response.data.data
    } else {
      throw new Error('Failed to fetch teacher-reservation')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}