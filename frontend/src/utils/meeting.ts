import moment from "moment";
export type ValuePiece = Date | null;

// 현재시간을 문자열로 변환하는 함수
export const getCurrentTimeString = (): string => {
    const currentTime = new Date();
    const year = currentTime.getFullYear();
    const month = String(currentTime.getMonth() + 1).padStart(2, '0');
    const date = String(currentTime.getDate()).padStart(2, '0');
    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${date} ${hours}:${minutes}`;
  };


// 미팅 활성화 함수
export const isMeetingActive = (meetingDate: string, meetingTime: string): boolean => {
  const currentTime = new Date();
  const meetingDateTime = new Date(`${meetingDate}T${meetingTime}`);
  const timeDiff = meetingDateTime.getTime() - currentTime.getTime();

  // 상담 시간 30분 전후로 활성화 상태로 설정
  // TODO 
  // return timeDiff > -10 * 60 * 1000 && timeDiff < 30 * 60 * 1000;
  return true;
};


// 진행, 예정인 상담내역만 보이게 판별해주는 함수
export const isMeetingVisible = (meetingDate: string, meetingTime: string): boolean => {
  const currentTimeString = getCurrentTimeString();
  const meetingDateTimeString = `${meetingDate} ${meetingTime}`;

  // 현재 시간을 Date 객체로 변환
  const currentDateTime = new Date(currentTimeString);
  
  // 상담 시간을 Date 객체로 변환
  const meetingDateTime = new Date(meetingDateTimeString);
  
  // 상담 시간에 30분을 더한 시간을 계산
  const meetingEndTime = new Date(meetingDateTime.getTime() + 30 * 60000);

  // 날짜가 지난 상담은 보이지 않게 설정
  if (meetingDateTime < currentDateTime) {
    return false;
  }

  // 날짜가 같은 경우, 상담 시간이 지난 것만 보이지 않게 설정
  if (meetingDate === currentTimeString.split(' ')[0]) {
    // 상담 시간이 30분 지난 경우 보이지 않게 설정
    return currentDateTime <= meetingEndTime;
  }

  // 날짜가 지나지 않은 경우 모두 보이게 설정
  return true;
};

//날짜 변환
export const formatDate = (date: ValuePiece): string => {
  if (date instanceof Date) {
    return moment(date).format("YYYY년 MM월 DD일");
  }
  return '';
};

// 과거인지 판별하는 함수
export const isPastDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};