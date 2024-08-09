import React, { useEffect, useState } from "react";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import NavigateBack from "../../components/teacher/common/NavigateBack";
import { fetchRecordingsList } from "../../utils/openvidu";
import { Recording } from "../../types/openvidu";
import { handleDownload } from "../../api/openvidu";

const dummyRecordings: Recording[] = [
  { id: "1", name: "Recording 1", url: "/path/to/recording1" },
  { id: "2", name: "Recording 2", url: "/path/to/recording2" },
  { id: "3", name: "Recording 3", url: "/path/to/recording3" },
];

const TeacherMeetingRecordingList: React.FC = () => {
  const [recordings, setRecordings] = useState<Recording[]>(dummyRecordings);

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
    if (recordings === undefined || recordings.length == 0) {
      setRecordings(dummyRecordings);
    }
    console.log(recordings);
  }, [recordings]);

  const handleDelete = (id: string) => {
    setRecordings(recordings.filter((recording) => recording.id !== id));
  };

  return (
    <>
      <TeacherHeader />
      <div className="recordings-list mt-4 p-4 bg-white rounded-lg shadow-md">
        <NavigateBack backPage="홈" backLink="/" />
        <h2 className="text-2xl font-bold mb-4">녹화 파일 목록</h2>
        <ul>
          {recordings.map((recording) => (
            <li key={recording.id} className="flex justify-between items-center mb-2 p-2 border-b border-gray-200">
              <span>{recording.name}</span>
              <div>
                <button onClick={() => handleDownload(recording.url)} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                  Download
                </button>
                <button onClick={() => handleDelete(recording.id)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TeacherMeetingRecordingList;
