import React, { useEffect, useState } from "react";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import NavigateBack from "../../components/teacher/common/NavigateBack";
import { fetchRecordingsList } from "../../utils/openvidu";
import { Recording } from "../../types/openvidu";
import { handleDownload } from "../../api/openvidu";
import Title from "../../components/teacher/common/Title";


// 페이지 디자인용으로 진행하고, 나중에는 삭제해야합니다!
const dummyRecordings: Recording[] = [
  { id: "1", name: "Recording 1", url: "/path/to/recording1" },
  { id: "2", name: "Recording 2", url: "/path/to/recording2" },
  { id: "3", name: "Recording 3", url: "/path/to/recording3" },
];

const TeacherMeetingRecordingList: React.FC = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [noRecordings, setNoRecordings] = useState(false); // 녹화본이 없는 상태 관리

  useEffect(() => {
    async function fetchAllRecordings() {
      try {
        await fetchRecordingsList(setRecordings);
      } catch (error) {
        console.error("Failed to fetch recordings:", error);
      }
    }

    fetchAllRecordings();
  }, []);

  useEffect(() => {
    if (!recordings || recordings.length === 0) {
      setRecordings(dummyRecordings)
      // setNoRecordings(true); // 녹화본이 없을 때 상태를 true로 설정
    } else {
      setNoRecordings(false); // 녹화본이 있을 때 상태를 false로 설정
    }
    console.log(recordings);
  }, [recordings]);

  const handleDelete = (id: string) => {
    setRecordings(recordings.filter((recording) => recording.id !== id));
  };

  return (
    <>
      <TeacherHeader /> 
      <div className="mt-[130px] px-[20px] lg:px-[150px]">
        <NavigateBack backPage="화상상담" backLink="/meeting" />
        <Title title="녹화된 상담"/>
        {noRecordings ? (
          <p className="text-gray-600">저장된 녹화본이 없습니다.</p>
        ) : (
          <ul>
            {recordings.map((recording) => (
              <li key={recording.id} className="flex justify-between items-center mb-2 p-2 border-b border-gray-200">
                <span>{recording.name}</span>
                <div>
                  <button onClick={() => handleDownload(recording.url)} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                    다운로드
                  </button>
                  <button onClick={() => handleDelete(recording.id)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default TeacherMeetingRecordingList;
