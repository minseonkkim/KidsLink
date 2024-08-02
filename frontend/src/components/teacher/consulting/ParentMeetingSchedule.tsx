import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ParentMeetingScheduleProps {
  meetingId: number;
  date: string;
  time: string;
  teacherName: string;
  isActive: boolean;
}

const ParentMeetingSchedule: React.FC<ParentMeetingScheduleProps> = ({ meetingId, date, time, teacherName, isActive }) => {

  return (
    <div
      key={meetingId}
      className={`flex flex-col p-4 rounded-2xl ${
        isActive ? "bg-[#FFF9D7] hover:bg-[#ffec8a] border-1 border-[#FFEC8A]" : "bg-[#D3D3D3] cursor-not-allowed"
      } transition-colors duration-200`}
    >
      <div className="flex items-center">
        <div>
          <p className={`text-base font-bold ${isActive ? "text-[#757575]" : "text-gray-400"}`}>{date}</p>
          <p className={`text-base font-medium ${isActive ? "text-[#757575]" : "text-gray-400"}`}>{time}</p>
          <p className={`text-base font-medium ${isActive ? "text-[#757575]" : "text-gray-400"}`}>{teacherName}선생님과의 상담</p>
        </div>
      </div>
    </div>
  );
};

export default ParentMeetingSchedule;