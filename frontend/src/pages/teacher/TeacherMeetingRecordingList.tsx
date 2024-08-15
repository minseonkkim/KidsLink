import React, { useEffect, useState } from "react";
import { fetchRecordingsListByTeacherId } from "../../utils/openvidu";
import { Recording } from "../../types/openvidu";
import { fetchRecordings, handleDownload } from "../../api/openvidu";
import Title from "../../components/teacher/common/Title";
import TeacherLayout from "../../layouts/TeacherLayout";
import daramgi from "../../assets/teacher/meeting-daramgi.png";
import { getOneParentInfo, getTeacherId } from "../../api/Info";
import { convertTimestampToDateTime } from "../../utils/meeting";

// 페이지 디자인용으로 진행하고, 나중에는 삭제해야합니다!
// const dummyRecordings: Recording[] = [
//   // {meetingId}:{teacherId}:{parentId}:촬영날짜
//   { id: "1", name: "2-1-1-20240813", url: "/path/to/recording1" },
//   { id: "2", name: "2-1-1-20240814", url: "/path/to/recording2" },
//   { id: "3", name: "2-1-1-20240815", url: "/path/to/recording3" },
// ];

const TeacherMeetingRecordingList: React.FC = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [noRecordings, setNoRecordings] = useState(false); // 녹화본이 없는 상태 관리

  useEffect(() => {
    async function fetchAllRecordings() {
      // try {
      const teacherId = await getTeacherId();
      const fetchedRecordings = await fetchRecordingsListByTeacherId(teacherId);

      console.log("fetchAllRecordings 메서드 동작 fetchedRecordings:", fetchedRecordings);

      // Fetch parent names and format recording names
      const updatedRecordings = await Promise.all(
        fetchedRecordings.map(async (recording) => {
          const parts = recording.name.split("-");
          const parentId = parseInt(parts[2], 10);
          const meetingDateStr = parts[3]; // "20240813" 형식의 날짜 문자열

          // "20240813" 형식의 문자열을 Date 객체로 변환
          const meetingDate = new Date(
            `${meetingDateStr.slice(0, 4)}-${meetingDateStr.slice(4, 6)}-${meetingDateStr.slice(
              6,
              8
            )}`
          );

          // 날짜를 'YYYY년 MM월 DD일' 형식으로 변환
          const formattedDate = meetingDate.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          const parentInfo = await getOneParentInfo(parentId); // 부모님 이름 가져오기
          const childName = parentInfo.child.name;
          return {
            ...recording,
            name: `${formattedDate} ${childName} 학부모님과의 상담내용`,
          };
        })
      );

      setRecordings(updatedRecordings);
      // } catch (error) {
      //   console.error("Failed to fetch recordings:", error);
      // }
    }

    fetchAllRecordings();
  }, []);

  useEffect(() => {
    if (!recordings || recordings.length === 0) {
      // setRecordings(dummyRecordings);
      setNoRecordings(true); // 녹화본이 없을 때 상태를 true로 설정
    } else {
      setNoRecordings(false); // 녹화본이 있을 때 상태를 false로 설정
    }
    console.log(recordings);
  }, [recordings]);

  const handleDelete = (id: string) => {
    setRecordings(recordings.filter((recording) => recording.id !== id));
  };

  const tabs = [
    { label: "상담가능시간 open", link: "/meeting/reservation" },
    { label: "상담시간 확정", link: "/meeting/confirm" },
    { label: "예약된 화상상담", link: "/meeting/scheduled" },
    { label: "녹화된 상담", link: "/meeting/recordings" },
  ];

  return (
    <TeacherLayout
      activeMenu="meeting"
      setActiveMenu={() => {}}
      titleComponent={<Title title="녹화된 상담" tabs={tabs} />}
      imageSrc={daramgi}
    >
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
                <span className="text-xs text-gray-400 lg:mb-0 mb-2">
                  {convertTimestampToDateTime(recording.createdAt)}
                </span>
                <div className="flex flex-col lg:flex-row mt-2 lg:mt-0">
                  <button
                    onClick={() => handleDownload(recording.url)}
                    className="mr-[24px] mt-2 h-[40px] border-2 border-[#7C7C7C] bg-[#E3EEFF] px-3 py-1 font-bold rounded-[10px] hover:bg-[#D4DDEA] flex items-center"
                  >
                    다운로드
                  </button>
                  <button
                    onClick={() => handleDelete(recording.id)}
                    className="mr-[24px] mt-2 h-[40px] border-2 border-[#7C7C7C] bg-[#FFDFDF] px-3 py-1 font-bold rounded-[10px] hover:bg-[#FFC0C0] flex items-center text-center"
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </TeacherLayout>
  );
};

export default TeacherMeetingRecordingList;
