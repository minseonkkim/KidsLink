import { useEffect, useState } from "react";
import { useParentInfoStore } from "../../../stores/useParentInfoStore";
import { getClassTeacherInfo, getParentInfo } from "../../../api/Info";
import { ParentTeacherMeeting } from "../../../types/meeting";
import { formatDate } from "../../../utils/parent/dateUtils";
import { useNavigate } from "react-router-dom";

interface MeetingListProps {
  meetings: ParentTeacherMeeting[];
  isMeetingActive: (date: string, time: string) => boolean;
}

export default function MeetingList({
  meetings,
  isMeetingActive,
}: MeetingListProps) {
  const navigate = useNavigate();
  const { parentInfo, setParentInfo, setParentHasAccessedMeeting } =
    useParentInfoStore();
  const [teacherInfo, setTeacherInfo] = useState(null);

  useEffect(() => {
    async function fetchParentAndTeacherInfo() {
      if (!parentInfo) {
        const fetchedParentInfo = await getParentInfo();
        setParentInfo(fetchedParentInfo);
      }

      if (parentInfo) {
        const teacherData = await getClassTeacherInfo(
          parentInfo.child.kindergartenClass.kindergartenClassId
        );
        setTeacherInfo(teacherData);
      }
    }

    fetchParentAndTeacherInfo();
  }, [parentInfo, setParentInfo]);

  // 상담 끝나는 시간 알기 위해 시작 시간에 30분 더하는 함수
  function addMinutesToTime(time: string, minutes: number = 30): string {
    const [hours, minutesPart] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutesPart);
    date.setMinutes(date.getMinutes() + minutes);
    const resultHours = date.getHours().toString().padStart(2, "0");
    const resultMinutes = date.getMinutes().toString().padStart(2, "0");
    return `${resultHours}:${resultMinutes}`;
  }

  const handleMeetingClick = (meeting: ParentTeacherMeeting) => {
    setParentHasAccessedMeeting(true); // 사용자가 클릭했음을 표시
    navigate(`${meeting.meetingId}`);
  };

  return (
    <div className="w-full space-y-6 overflow-y-auto custom-scrollbar">
      {meetings.map((meeting) => {
        const isActive =
          meeting.meetingDate && meeting.meetingTime
            ? isMeetingActive(meeting.meetingDate, meeting.meetingTime)
            : false;
        return (
          <div
            key={meeting.meetingId}
            className={`flex flex-col px-6 py-5 rounded-2xl ${
              isActive
                ? "bg-[#FFF9D7] hover:bg-[#FFEC8A] transition-colors duration-200 cursor-pointer"
                : "bg-[#D3D3D3]"
            } transition-colors duration-200`}
            onClick={() => handleMeetingClick(meeting)}
          >
            <div
              className={`flex justify-between ${
                isActive ? "" : "opacity-50 cursor-not-allowed"
              }`}
            >
              <p className="text-base font-bold text-[#353c4e]">
                {teacherInfo?.name} 선생님과의 상담
              </p>
              <div className="flex gap-3">
                {parentInfo?.profile && (
                  <img
                    src={parentInfo.profile}
                    alt="Parent Profile"
                    className="w-8 h-8 rounded-full"
                  />
                )}
                {teacherInfo?.profile && (
                  <img
                    src={teacherInfo.profile}
                    alt="Teacher Profile"
                    className="w-8 h-8 rounded-full"
                  />
                )}
              </div>
            </div>

            <p className="text-sm font-medium text-[#757575]">
              {formatDate(meeting.meetingDate)}
            </p>
            <p className="text-sm font-medium text-[#757575]">
              {meeting.meetingTime} ~ {addMinutesToTime(meeting.meetingTime)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
