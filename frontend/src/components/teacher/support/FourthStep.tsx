import React, { useEffect, useState } from "react";

// 날짜 계산 함수
const generateRecordingDates = () => {
  const today = new Date();
  
  const recordings = [
    { id: "1", name: "Recording 1", date: new Date(today) }, // 오늘 날짜
    { id: "2", name: "Recording 2", date: new Date(today.setDate(today.getDate() - 1)) }, // 하루 전
    { id: "3", name: "Recording 3", date: new Date(today.setDate(today.getDate() - 1)) }, // 이틀 전
    { id: "4", name: "Recording 4", date: new Date(today.setDate(today.getDate() - 1)) }, // 삼일 전
  ];

  return recordings;
};

const TeacherMeetingRecordingList = () => {
  const [recordings, setRecordings] = useState(generateRecordingDates()); // 날짜 기반으로 더미 데이터 생성
  const [noRecordings, setNoRecordings] = useState(false); // 녹화본이 없는 상태 관리

  useEffect(() => {
    // 실제 데이터가 없기 때문에 더미 데이터를 설정
    if (!recordings || recordings.length === 0) {
      setNoRecordings(true);
    } else {
      setNoRecordings(false);
    }
  }, [recordings]);

  return (
    <div className="w-full mt-3 mb-32 px-4 py-0 lg:px-8 lg:py-8">
      <div className="dark-overlay"></div>
      <div className="w-full mt-10 mb-32 px-4 lg:px-8 py-6 lg:py-8">
        <ul className="list-none p-0">
          {recordings.map((recording) => (
            <li
              key={recording.id}
              className="flex flex-col lg:flex-row justify-between items-center mb-4 p-4 border border-gray-200 rounded-md shadow-sm"
            >
              <span className="text-lg font-semibold">{recording.name}</span>
              <span className="text-xs text-gray-400 lg:mb-0 mb-2">
                {recording.date.toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <div className="flex flex-col lg:flex-row mt-2 lg:mt-0">
                <button
                  className="mr-[24px] mt-2 h-[40px] border-2 border-[#7C7C7C] bg-[#E3EEFF] px-3 py-1 font-bold rounded-[10px] hover:bg-[#D4DDEA] flex items-center"
                >
                  다운로드
                </button>
                <button
                  className="mr-[24px] mt-2 h-[40px] border-2 border-[#7C7C7C] bg-[#FFDFDF] px-3 py-1 font-bold rounded-[10px] hover:bg-[#FFC0C0] flex items-center text-center"
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TeacherMeetingRecordingList;
