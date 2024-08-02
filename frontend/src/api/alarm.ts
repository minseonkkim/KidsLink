import axiosInstance from './token/axiosInstance'

interface Alarm{
  id: number;
  contents: string;
  date: string;
  code: string;
}

// 알람 개수 조회
export async function getAlarmCount() {
  try  {
    const response = await axiosInstance.get('notification/count')

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

// 알림 조회
export async function getAllAlarms():Promise<Alarm[]> {
  try  {
    const response = await axiosInstance.get('notification')

    if (response.data.status === 'success') {
      console.log(response.data.data) // 확인 후 삭제
      return response.data.data
    } else {
      throw new Error('Failed to get all alarms')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

// 특정 알림 삭제
export async function deleteAlarm(alarmId: number) {
  try  {
    const response = await axiosInstance.delete(`notification/${alarmId}`)

    if (response.data.status === 'success') {
      console.log(response.data.data) // 확인 후 삭제
      return response.data.data
    } else {
      throw new Error('Failed to delete alarm')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

// 전체 알림 삭제
export async function deleteAllAlarms() {
  try  {
    const response = await axiosInstance.delete('notification')

    if (response.data.status === 'success') {
      console.log(response.data.data) // 확인 후 삭제
      return response.data.data
    } else {
      throw new Error('Failed to delete all alarms')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}
