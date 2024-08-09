import axiosInstance from "./token/axiosInstance"

// 학부모 버스 탑승 여부 작성
export async function postKidBoardingStatus(childId: number) {
  try {
    const response = await axiosInstance.put(`busstop/child/${childId}/status`)

    if (response.data.status === 'success') {
      return response.data.message
    } else {
      throw new Error('Failed to post child-status')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

// 학부모 버스 탑승 여부 조회
export async function getKidBoardingStatus(childId: number) {
  try {
    const response = await axiosInstance.get(`busstop/child/${childId}`)

    if (response.data.status === 'success') {
      return response.data.data
    } else {
      throw new Error('Failed to get child-status')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

// 모든 정류장 조회
export async function getAllBusStops(kindergartenId: number) {
  try {
    const response = await axiosInstance.get(`busstop/kindergarten/${kindergartenId}`)

    if (response.data.status === 'success') {
      // console.log(response.data.data)
      return response.data.data
    } else {
      throw new Error('Failed to get all-busstops')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

// 특정 정류장 조회
export async function getBusStop(busStopId: number) {
  try {
    const response = await axiosInstance.get(`busstop/${busStopId}`)

    if (response.data.status === 'success') {
      return response.data.data
    } else {
      throw new Error('Failed to get busstop')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

// 버스 출발 알림 전송
export async function postBusStart(busStopId: number) {
  try {
    const response = await axiosInstance.post(`bus/${busStopId}/notification`)

    if (response.data.status === 'success') {
      return response.data.data
    } else {
      throw new Error('Failed to post bus-start')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}