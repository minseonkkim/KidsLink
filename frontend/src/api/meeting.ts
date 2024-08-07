import {
  MeetingInfo,
  ParentReservation,
  ParentTeacherMeeting,
  Reservation,
  SessionData,
  TeacherMeetingReservation,
} from "../types/meeting";
import axiosInstance from "./token/axiosInstance";

// 전체 상담 가능날짜 조회
export async function getAllPossibleReservations(): Promise<Reservation[]> {
  try {
    const response = await axiosInstance.get("meeting");

    if (response.data.status === "success") {
      return response.data.data;
    } else {
      throw new Error("Failed to get reservations");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// 상담예약일자 가져오기
export async function fetchSessionId(): Promise<SessionData> {
  try {
    const response = await axiosInstance.get("/meeting/reservation");
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch session data:", error);
    throw error;
  }
}

// 학부모 상담 예약 제출
export async function postAllPossibleReservations(
  selectedReservations: ParentReservation[]
): Promise<ParentReservation[]> {
  console.log(selectedReservations);
  try {
    const response = await axiosInstance.post("meeting", selectedReservations);
    console.log("meeeting.postAllPossibleReservations : ", response)

    if (response.data.status === "success") {
      return response.data.data;
    } else {
      throw new Error("Failed to post reservations");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// 교사 상담시간 오픈
export async function postTeacherReservations(
  data: TeacherMeetingReservation[]
) {
  console.log("교사 시간 보내는 데이터: ", data);
  try {
    const response = await axiosInstance.post("meeting/open", data);

    if (response.data.status === "success") {
      console.log(response);
      console.log("response.data.data");
      console.log(response.data.data); // 확인 후 삭제
      return response.data.data;
    } else {
      throw new Error("Failed to post reservations");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

//상담일자 확정하기
export async function confirmMeeting() {
  console.log("상담일자 확정하기");
  try {
    const response = await axiosInstance.post("meeting/confirm");
    if (response.data.status === "success") {
      console.log(response.data);
      return response.data.data;
    } else {
      throw new Error("Failed to confirmMeeting");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// 예약된 전체 상담 리스트 조회
export async function getConfirmedMeeting(): Promise<ParentTeacherMeeting[]> {
  try {
    const response = await axiosInstance.get("/meeting/reservation");
    if (response.data.status === "success") {
      return response.data.data as ParentTeacherMeeting[];
    } else {
      throw new Error("Failed to get confirmed meetings");
    }
  } catch (error) {
    console.error("Error fetching confirmed meetings:", error);
    throw error;
  }
}

// 특정 상담 조회
export async function getMeetingInfo(meetingId: number): Promise<MeetingInfo> {
  try {
    const response = await axiosInstance.get(`/meeting/${meetingId}`);
    if (response.data.status === "success") {
      console.log(response.data);
      return response.data.data;
    } else {
      throw new Error("Failed to get meetingInfo");
    }
  } catch (error) {
    console.error("Error fetching meeting info:", error);
    throw error;
  }
}

// 학부모가 예약한 날짜, 시간 조회하기
export async function getParentSelectedTime(){
  try{
    const response = await axiosInstance.get('meeting/selected');
    if(response.data.status === 'success'){
      console.log(response.data.data);
      return response.data.data;
    } else {
      throw new Error('Failed to get parent selected info');
    }
  } catch (error) {
    console.error('Error fetching parent selected info:', error);
    throw error;
  }
}
