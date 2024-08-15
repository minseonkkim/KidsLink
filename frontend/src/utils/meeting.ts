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

export const convertTimestampToDateTime = (timestamp: number): string => {
    // 밀리초 단위 타임스탬프를 Date 객체로 변환
    const date = new Date(timestamp);
  
    // 연도, 월, 일, 시, 분, 초 추출
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1; // getUTCMonth()는 0부터 시작하므로 1을 더해줌
    const day = date.getUTCDate();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
  
    // "YYYY년 MM월 DD일 HH시 mm분 ss초" 형식으로 반환
    return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분 ${seconds}초`;
  }

  

// 미팅 활성화 함수
export const isMeetingActive = (meetingDate: string, meetingTime: string): boolean => {
  const currentTime = new Date(); // 현재 시간
  const meetingDateTime = new Date(`${meetingDate}T${meetingTime}`); // 상담 시간
  const timeDiff = meetingDateTime.getTime() - currentTime.getTime(); // 상담 시간과 현재 시간의 차이 (밀리초)
  
  console.log("현재 시간:", currentTime);
  console.log("상담 시간:", meetingDateTime);
  console.log("시간 차이 (밀리초):", timeDiff);
  console.log(-30*1000*60)
  console.log(10*1000*60)

/*
  // 상담 시작 10분 전부터 상담 시작 30분 후까지의 범위 확인
  if (-30 * 60 * 1000 <= timeDiff && timeDiff <= 10 * 60 * 1000) {
    console.log("참");
    return true; // 상담 시간이 10분 전 ~ 30분 후 범위에 있으면 true 반환
  }

  console.log("거짓");
  return false; // 그 외의 경우 false 반환
  */

    // 상담 시간 30분 전후로 활성화 상태로 설정
  // TODO 
  // return timeDiff > -10 * 60 * 1000 && timeDiff < 30 * 60 * 1000;
  return true;
};


// 진행, 예정인 상담내역만 보이게 판별해주는 함수
export const isMeetingVisible = (meetingDate: string, meetingTime: string): boolean => {
  const currentTimeString = getCurrentTimeString(); // 현재 시간을 문자열로 가져옴
  const meetingDateTimeString = `${meetingDate} ${meetingTime}`; // 상담 날짜와 시간을 문자열로 결합

  // 현재 시간을 Date 객체로 변환
  const currentDateTime = new Date(currentTimeString);
  
  // 상담 시간을 Date 객체로 변환
  const meetingDateTime = new Date(meetingDateTimeString);
  
  // 상담 시간에 30분을 더한 시간을 계산
  const meetingEndTime = new Date(meetingDateTime.getTime() + 30 * 60000);

  console.log("현재 시간:", currentTimeString);
  console.log("상담 종료 시간:", meetingEndTime);
  console.log("시간이 지났나?", currentDateTime <= meetingEndTime);

  // 상담 종료 시간이 현재 시간보다 이전인 경우 상담을 보이지 않게 설정
  if (currentDateTime > meetingEndTime) {
    return false;
  }

  // 상담 시간이 현재 시간 이후라면 보이도록 설정
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