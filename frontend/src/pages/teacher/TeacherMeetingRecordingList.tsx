import React, { useEffect, useState } from "react";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import NavigateBack from "../../components/teacher/common/NavigateBack";
import { fetchRecordingsList } from "../../utils/openvidu";
import { Recording } from "../../types/openvidu";

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

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const contentDisposition = response.headers.get("Content-Disposition");
      const contentType = response.headers.get("Content-Type");
      const blob = await response.blob();

      let fileName = "download";
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (fileNameMatch.length > 1) {
          fileName = fileNameMatch[1];
        }
      } else if (contentType) {
        const extension = contentType.split("/")[1];
        fileName = `kidslink.${extension}`;
      }

      const link = document.createElement("a");
      const objectURL = URL.createObjectURL(blob);
      link.href = objectURL;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectURL);
    } catch (error) {
      console.error("Failed to download file:", error);
    }
    // window.location.href = url;
  };

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
