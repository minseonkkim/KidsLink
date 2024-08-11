import { useEffect, useState } from "react";
import moment from "moment";
import "moment/locale/ko";
import { getAllParentSchedules, getParentSchedules } from "../../api/schedule";
import { getMeetingInfo } from "../../api/meeting";
import CustomCalendar from "../../components/parent/common/CustomCalendar";
import styled, { createGlobalStyle } from "styled-components";
import { FaPills, FaRegTimesCircle, FaSchool, FaChalkboardTeacher } from "react-icons/fa";

// Type definitions for schedules
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
    <div className="relative min-h-[100dvh] flex flex-col bg-[#FFEC8A]">
      <GlobalStyle />
      <ScrollContainer>
        <div className="flex flex-col justify-center items-center">
          <CustomCalendar
            schedules={schedules}
            onDateClick={handleDateClick}
            onMonthChange={handleMonthChange}
          />
        </div>

        <div className="px-4">
          {detailedSchedules && (
            <ScheduleListContainer hasContent={hasContent}>
              <ScheduleList>
                {detailedSchedules.dosageSchedules.length > 0 && (
                  <div>
                    {detailedSchedules.dosageSchedules.map((schedule) => (
                      <ScheduleItem key={schedule.dosageId}>
                        <div className="bg-[#E7DFFF] text-purple-600">
                          <FaPills />
                        </div>
                        <p>{schedule.name}</p>
                      </ScheduleItem>
                    ))}
                  </div>
                )}
                {detailedSchedules.absentSchedules.length > 0 && (
                  <div>
                    {detailedSchedules.absentSchedules.map((schedule) => (
                      <ScheduleItem key={schedule.absentId}>
                        <div className="bg-[#FFDFDF] text-red-600">
                          <FaRegTimesCircle />
                        </div>
                        <p>{schedule.reason}</p>
                      </ScheduleItem>
                    ))}
                  </div>
                )}
                {detailedSchedules.kindergartenSchedules.length > 0 && (
                  <div>
                    {detailedSchedules.kindergartenSchedules.map((schedule) => (
                      <ScheduleItem key={schedule.id}>
                        <div className="bg-[#FFF7CA] text-yellow-600">
                          <FaSchool />
                        </div>
                        <p>{schedule.content}</p>
                      </ScheduleItem>
                    ))}
                  </div>
                )}
                {detailedSchedules.meetingSchedules.length > 0 && (
                  <div>
                    {detailedSchedules.meetingSchedules.map((schedule) => {
                      const meetingInfo = meetingInfoMap[schedule.meetingId];
                      return (
                        <ScheduleItem key={schedule.meetingId}>
                          <div className="bg-[#FFF7CA] text-green-600">
                            <FaChalkboardTeacher />
                          </div>
                          <p>
                            {schedule.meetingTime}{" "}
                            {meetingInfo && ` ${meetingInfo.teacherName} 선생님과의 상담`}
                          </p>
                        </ScheduleItem>
                      );
                    })}
                  </div>
                )}
              </ScheduleList>
            </ScheduleListContainer>
          )}
        </div>
      </ScrollContainer>
    </div>
  );
}

// Styled components for the rest of your ParentSchedule
const GlobalStyle = createGlobalStyle`
  body {
    overflow: hidden; /* 전체 화면 스크롤 비활성화 */
  }
`;

const ScrollContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: calc(100vh - 80px); /* 상단에서 50px 떨어진 위치 */
  background-color: #fff;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 150px;
  overflow-y: auto; /* 내부 스크롤 활성화 */
`;

const ScheduleListContainer = styled.div<{ hasContent: boolean }>`
  padding: 15px;
  border-radius: 15px;
  background-color: #f9f9f9; /* 흰색 배경 */
  box-shadow: ${({ hasContent }) =>
    hasContent ? "0 4px 8px rgba(0, 0, 0, 0.1)" : "none"};
`;

const ScheduleList = styled.div`
  width: 100%;
  margin-top: 10px;
`;

const ScheduleItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px; /* 리스트 간의 간격 감소 */
  padding: 12px;
  border-radius: 12px;
  background-color: #ffffff; /* 흰색 배경 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px); /* 호버 시 살짝 위로 이동 */
  }

  & > div {
    border-radius: 50%;
    padding: 10px;
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: none; /* 아이콘 배경의 그림자 제거 */
  }

  p {
    margin: 0;
    font-size: 1rem;
    color: #353c4e;
  }
`;
