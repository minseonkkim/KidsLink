import axiosInstance from './token/axiosInstance'

// 알람 개수 조회
export async function getAlarmCount() {
  try  {
    const response = await axiosInstance.get('api/notification/count')

    if (response.data.status === 'success') {
      console.log(response.data.data) // 확인 후 삭제
      return response.data.data
    } else {
      throw new Error('Failed to get alarm-count')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}