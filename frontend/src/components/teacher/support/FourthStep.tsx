import React, { useEffect, useState } from "react";

// 페이지 디자인용으로 사용될 더미 데이터
const dummyRecordings = [
  { id: "1", name: "Recording 1", url: "/path/to/recording1" },
  { id: "2", name: "Recording 2", url: "/path/to/recording2" },
  { id: "3", name: "Recording 3", url: "/path/to/recording3" },
];

const TeacherMeetingRecordingList = () => {
  const [recordings, setRecordings] = useState(dummyRecordings); // 더미 데이터 사용
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
    <div className="p-6">
      <div className="dark-overlay"></div>
      <h1 className="text-2xl font-bold mb-6">녹화된 상담</h1>
      <div className="w-full mt-10 mb-32 px-4 lg:px-8 py-6 lg:py-8">
        {noRecordings ? (
          <p className="text-gray-600">저장된 녹화본이 없습니다.</p>
        ) : (
          <ul className="list-none p-0">
            {recordings.map((recording) => (
              <li
                key={recording.id}
                className="flex flex-col lg:flex-row justify-between items-center mb-4 p-4 border border-gray-200 rounded-md shadow-sm"
              >
                <span className="text-lg font-semibold">{recording.name}</span>
                <div className="flex flex-col lg:flex-row mt-2 lg:mt-0">
                  <div className="mb-2 lg:mb-0 lg:mr-2 px-4 py-2 bg-blue-300 text-white rounded cursor-default">
                    다운로드
                  </div>
                  <div className="px-4 py-2 bg-red-300 text-white rounded cursor-default">
                    삭제
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TeacherMeetingRecordingList;
