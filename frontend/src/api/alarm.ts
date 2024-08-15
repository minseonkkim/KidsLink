import { Notification } from '../components/parent/common/MainHeader';
import axiosInstance from './token/axiosInstance'

export interface Alarm{
  id: number;
  contents: string;
  date: string;
  code: string;
}

const mapAlarmToNotification = (alarm: Alarm): Notification => {
  // Alarm의 code를 Notification의 code 타입으로 변환
  const codeMapping: { [key: string]: Notification['code'] } = {
    'NOTICE': 'NOTICE',
    'DIARY': 'DIARY',
    'ALBUM': 'ALBUM',
    'BUS': 'BUS',
    'MEETING': 'MEETING',
    'DOCUMENT': 'DOCUMENT',
  };

  return {
    id: alarm.id,
    date: alarm.date,
    contents: alarm.contents,
    code: codeMapping[alarm.code] || 'NOTICE' // 기본값 설정
  };
}

// 알람 개수 조회
export async function getAlarmCount() {
  try  {
    const response = await axiosInstance.get('notification/count')

    if (response.data.status === 'success') {
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
export async function getAllAlarms():Promise<Notification[]> {
  try  {
    const response = await axiosInstance.get('notification')

    if (response.data.status === 'success') {
      const alarms: Alarm[] = response.data.data;
      return alarms.map(mapAlarmToNotification);
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
      return response.data.data
    } else {
      throw new Error('Failed to delete all alarms')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}
