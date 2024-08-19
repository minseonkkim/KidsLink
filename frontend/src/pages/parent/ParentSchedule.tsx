import { useEffect, useState } from "react";
import moment from "moment";
import "moment/locale/ko";
import { getAllParentSchedules, getParentSchedules } from "../../api/schedule";
import { getMeetingInfo } from "../../api/meeting";
import CustomCalendar from "../../components/parent/common/CustomCalendar";
import { FaPills, FaRegTimesCircle, FaSchool, FaChalkboardTeacher } from "react-icons/fa";

interface DosageSchedule {
  dosageId: number;
  name: string;
}

interface AbsentSchedule {
  absentId: number;
  reason: string;
}

interface KindergartenSchedule {
  id: number;
  content: string;
}

interface MeetingSchedule {
  meetingId: number;
  meetingTime: string;
}

interface DetailedSchedule {
  dosageSchedules: DosageSchedule[];
  absentSchedules: AbsentSchedule[];
  kindergartenSchedules: KindergartenSchedule[];
  meetingSchedules: MeetingSchedule[];
}

interface MeetingInfo {
  id: number;
  teacherName: string;
}

export default function ParentSchedule() {
  const [schedules, setSchedules] = useState<string[]>([]);
  const [detailedSchedules, setDetailedSchedules] = useState<DetailedSchedule | null>(null);
  const [meetingInfoMap, setMeetingInfoMap] = useState<{ [key: number]: MeetingInfo }>({});

  const fetchSchedules = async (year: number, month: number) => {
    try {
      const fetchedSchedules = await getAllParentSchedules(year, month);
      setSchedules(fetchedSchedules);
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
    }
  };

  const fetchDetailedSchedules = async (date: string) => {
    try {
      const detailedSchedule = await getParentSchedules(date);
      setDetailedSchedules(detailedSchedule);

      if (detailedSchedule.meetingSchedules.length > 0) {
        const meetingInfoPromises = detailedSchedule.meetingSchedules.map((meeting) =>
          getMeetingInfo(meeting.meetingId)
        );
        const meetingInfoResults = await Promise.all(meetingInfoPromises);
        const meetingInfoMap = meetingInfoResults.reduce((acc, info) => {
          acc[info.id] = info;
          return acc;
        }, {} as { [key: number]: MeetingInfo });
        setMeetingInfoMap(meetingInfoMap);
      }
    } catch (error) {
      console.error("Failed to fetch detailed schedule:", error);
    }
  };

  useEffect(() => {
    const current = new Date();
    const year = moment(current).year();
    const month = moment(current).month() + 1;
    fetchSchedules(year, month);
    fetchDetailedSchedules(moment(current).format("YYYY-MM-DD"));
  }, []);

  const handleDateClick = (date: Date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    fetchDetailedSchedules(formattedDate);
  };

  const handleMonthChange = (year: number, month: number) => {
    fetchSchedules(year, month);
  };

  const hasContent =
    detailedSchedules &&
    (detailedSchedules.dosageSchedules.length > 0 ||
      detailedSchedules.absentSchedules.length > 0 ||
      detailedSchedules.kindergartenSchedules.length > 0 ||
      detailedSchedules.meetingSchedules.length > 0);

  return (
    <div className="relative min-h-[100dvh] flex flex-col bg-[#FFEC8A] overflow-hidden">
      <div className="absolute bottom-0 h-[80%] flex flex-col w-full bg-white shadow-top rounded-tl-[25px] rounded-tr-[25px] py-6 px-8 animate-slideUp">
        <div className="overflow-y-auto">
          <div className="flex flex-col justify-center items-center mb-6">
            <CustomCalendar
              schedules={schedules}
              onDateClick={handleDateClick}
              onMonthChange={handleMonthChange}
            />
          </div>

          <div className="h-[1px] bg-[#FFDAB9] my-4" />

          <div className="px-4">
            {detailedSchedules && (
              <div className="flex flex-col gap-4">
                {detailedSchedules.dosageSchedules.length > 0 && (
                  <div className="flex flex-col p-4 bg-[#FFF9D7] rounded-2xl shadow-md hover:bg-[#FFEC8A] transition-colors duration-200 cursor-pointer">
                    <div className="flex items-center">
                      <div className="flex gap-2 bg-[#FFECB3] text-[#795548] p-2 rounded-full">
                        <FaPills className="h-5 w-5" />
                      </div>
                      <p className="ml-4 font-semibold text-gray-800">투약</p>
                    </div>
                    {detailedSchedules.dosageSchedules.map((schedule) => (
                      <p key={schedule.dosageId} className="mt-2 ml-10 text-gray-800">
                        {schedule.name}
                      </p>
                    ))}
                  </div>
                )}
                {detailedSchedules.absentSchedules.length > 0 && (
                  <div className="flex flex-col p-4 bg-[#FFF9D7] rounded-2xl shadow-md hover:bg-[#FFEC8A] transition-colors duration-200 cursor-pointer">
                    <div className="flex items-center">
                      <div className="flex gap-2 bg-[#FFCC80] text-[#E65100] p-2 rounded-full">
                        <FaRegTimesCircle className="h-5 w-5" />
                      </div>
                      <p className="ml-4 font-semibold text-gray-800">결석</p>
                    </div>
                    {detailedSchedules.absentSchedules.map((schedule) => (
                      <p key={schedule.absentId} className="mt-2 ml-10 text-gray-800">
                        {schedule.reason}
                      </p>
                    ))}
                  </div>
                )}
                {detailedSchedules.kindergartenSchedules.length > 0 && (
                  <div className="flex flex-col p-4 bg-[#FFF9D7] rounded-2xl shadow-md hover:bg-[#FFEC8A] transition-colors duration-200 cursor-pointer">
                    <div className="flex items-center">
                      <div className="flex gap-2 bg-[#FFF59D] text-[#F57F17] p-2 rounded-full">
                        <FaSchool className="h-5 w-5" />
                      </div>
                      <p className="ml-4 font-semibold text-gray-800">학사일정</p>
                    </div>
                    {detailedSchedules.kindergartenSchedules.map((schedule) => (
                      <p key={schedule.id} className="mt-2 ml-10 text-gray-800">
                        {schedule.content}
                      </p>
                    ))}
                  </div>
                )}
                {detailedSchedules.meetingSchedules.length > 0 && (
                  <div className="flex flex-col p-4 bg-[#FFF9D7] rounded-2xl shadow-md hover:bg-[#FFEC8A] transition-colors duration-200 cursor-pointer">
                    <div className="flex items-center">
                      <div className="flex gap-2 bg-[#DCE775] text-[#33691E] p-2 rounded-full">
                        <FaChalkboardTeacher className="h-5 w-5" />
                      </div>
                      <p className="ml-4 font-semibold text-gray-800">상담</p>
                    </div>
                    {detailedSchedules.meetingSchedules.map((schedule) => {
                      const meetingInfo = meetingInfoMap[schedule.meetingId];
                      return (
                        <p key={schedule.meetingId} className="mt-2 ml-10 text-gray-800">
                          {schedule.meetingTime}{" "}
                          {meetingInfo && ` ${meetingInfo.teacherName} 선생님과의 상담`}
                        </p>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
