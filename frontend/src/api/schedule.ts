import axiosInstance from './token/axiosInstance'

// 부모 일정 전체 조회 함수
export async function getAllParentSchedules(year: number, month: number): Promise<string[]> {
  try {
    const response = await axiosInstance.get(`schedule/parent?year=${year}&month=${month}`)

    if (response.data.status === 'success') {
      console.log(response.data.data) // 확인 후 삭제
      return response.data.data;
    } else {
      throw new Error('Failed to fetch schedules')
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

