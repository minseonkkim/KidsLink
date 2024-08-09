import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import "moment/locale/ko";
import {
  getAllParentSchedules,
  getParentSchedules,
} from "../../api/schedule";
import { getMeetingInfo } from "../../api/meeting";
import styled, { createGlobalStyle } from "styled-components";
import {
  FaPills,
  FaRegTimesCircle,
  FaSchool,
  FaChalkboardTeacher,
} from "react-icons/fa";
import daramgi from "../../assets/parent/cute-daramgi.png"; // 드람기 이미지 경로

// 타입 정의 추가
interface DosageSchedule {
  dosageId: number;
  name: string;
  // 다른 필요한 필드들...
}

interface AbsentSchedule {
  absentId: number;
  reason: string;
  // 다른 필요한 필드들...
}

interface KindergartenSchedule {
  id: number;
  content: string;
  // 다른 필요한 필드들...
}

interface MeetingSchedule {
  meetingId: number;
  meetingTime: string;
  // 다른 필요한 필드들...
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
  // 다른 필요한 필드들...
}

// 전체 화면 스크롤 비활성화
const GlobalStyle = createGlobalStyle`
  body {
    overflow: hidden; /* 전체 화면 스크롤 비활성화 */
  }
`;

const CalendarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-radius: 20px;
  background-color: #ffffff; /* 흰색 배경 */
`;

const StyledCalendar = styled(Calendar)`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .react-calendar {
    width: 100% !important;
    border-radius: 20px; /* 둥근 모서리 */
    font-family: "Comic Sans MS", cursive, sans-serif !important; /* 귀여운 폰트 */
    padding: 20px; /* 내부 여백 */
    border: none; /* 테두리 제거 */
    box-shadow: none; /* 그림자 제거 */
  }

  .react-calendar__navigation {
    display: flex;
    justify-content: space-between;
    border-radius: 20px 20px 0 0;
    height: 50px;
    background: transparent; /* 배경 투명 */
    padding: 0 10px;
  }

  .react-calendar__navigation__label {
    font-size: 1.2rem;
    font-weight: 600;
    color: #353c4e;
  }

  .react-calendar__navigation button {
    background-color: transparent; /* 버튼 배경 투명 */
    border: none;
    border-radius: 50%;
    padding: 10px;
    cursor: pointer;
  }

  .react-calendar__navigation button:enabled:hover,
  .react-calendar__navigation button:enabled:focus {
    background-color: transparent; /* 호버 및 포커스 시 배경색 제거 */
  }

  .react-calendar__month-view__weekdays {
    display: flex;
    flex-wrap: wrap;
    font-size: 1rem;
    color: #555;
  }

  .react-calendar__month-view__weekdays__weekday {
    flex: 0 0 14.2857%;
    text-align: center;
    margin-bottom: 10px;
  }

  .react-calendar__month-view__days {
    display: flex;
    flex-wrap: wrap;
  }

  .react-calendar__month-view__days__day {
    flex: 0 0 14.2857%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    height: 70px; /* 날짜 칸 높이 */
    position: relative;
    border-radius: 10px; /* 날짜 칸 둥근 모서리 */
    box-shadow: none; /* 날짜 칸 그림자 제거 */
    background-color: #fff; /* 날짜 칸 배경색 */
  }

  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus,
  .react-calendar__tile--active {
    background: #ff7f7f; /* 진한 핑크색 */
    color: white;
    border-radius: 10px;
  }

  .react-calendar__tile--now {
    background: #ffffa6;
    border-radius: 10px;
    color: black;
  }

  .react-calendar__tile--now:enabled:hover,
  .react-calendar__tile--now:enabled:focus {
    background: #ffc0cb; /* 라이트 핑크 */
    border-radius: 10px;
  }

  .react-calendar__tile > abbr {
    margin-bottom: auto;
  }

  .react-calendar__month-view__days__day--neighboringMonth {
    color: #b0b0b0;
  }

  .custom-icon {
    position: absolute;
    top: 70%; /* 다람쥐 이미지가 더 아래로 가도록 설정 */
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30px; /* 아이콘 너비 */
    height: 30px; /* 아이콘 높이 */
    pointer-events: none; /* 아이콘이 클릭을 방해하지 않도록 설정 */
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

export default function ParentSchedule() {
  const [value, setValue] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(
    moment(value).format("YYYY-MM-DD")
  );
  const [schedules, setSchedules] = useState<string[]>([]);
  const [detailedSchedules, setDetailedSchedules] =
    useState<DetailedSchedule | null>(null);
  const [meetingInfoMap, setMeetingInfoMap] = useState<{
    [key: number]: MeetingInfo;
  }>({});

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
        const meetingInfoPromises = detailedSchedule.meetingSchedules.map(
          (meeting) => getMeetingInfo(meeting.meetingId)
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
    const current = value;
    const year = moment(current).year();
    const month = moment(current).month() + 1;
    fetchSchedules(year, month);
    fetchDetailedSchedules(moment(current).format("YYYY-MM-DD"));
  }, [value]);

  useEffect(() => {
    if (selectedDate) {
      fetchDetailedSchedules(selectedDate);
    }
  }, [selectedDate]);

  const handleDateClick = (date: Date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    setSelectedDate(formattedDate);
    setValue(date);
  };

  const getActiveMonth = (activeStartDate: Date) => {
    const year = moment(activeStartDate).year();
    const month = moment(activeStartDate).month() + 1;
    fetchSchedules(year, month);
  };

  const addContent = ({ date }: { date: Date }) => {
    const dateString = moment(date).format("YYYY-MM-DD");
    const hasSchedule = schedules.includes(dateString);
    return hasSchedule ? (
      <img src={daramgi} alt="daramgi" className="custom-icon" />
    ) : null;
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
          <CalendarContainer>
            <StyledCalendar
              locale="ko"
              onChange={(date) => handleDateClick(date as Date)}
              value={value}
              next2Label={null}
              prev2Label={null}
              formatDay={(locale: string, date: Date) =>
                moment(date).format("D")
              }
              tileContent={addContent}
              showNeighboringMonth={true}
              onActiveStartDateChange={({ activeStartDate }) =>
                getActiveMonth(activeStartDate!)
              }
            />
          </CalendarContainer>
        </div>

        <div className="px-4">
          {selectedDate && detailedSchedules && (
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
                            {meetingInfo &&
                              ` ${meetingInfo.teacherName} 선생님과의 상담`}
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
