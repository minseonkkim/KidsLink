import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import "moment/locale/ko";
import {
  getAllParentSchedules,
  getParentSchedules,
} from "../../api/schedule";
import { getMeetingInfo } from "../../api/meeting";
import styled from "styled-components";
import {
  FaPills,
  FaRegTimesCircle,
  FaSchool,
  FaChalkboardTeacher,
} from "react-icons/fa";
import daramgi from "../../assets/parent/cute-daramgi.png"; // 드람기 이미지 경로

const CalendarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2); /* 입체감을 위한 그림자 */
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
    background-color: #ffebcd !important; /* 부드러운 베이지 배경 */
    border-radius: 20px; /* 둥근 모서리 */
    font-family: "Comic Sans MS", cursive, sans-serif !important; /* 귀여운 폰트 */
    padding: 20px; /* 내부 여백 */
    border: none; /* 테두리 제거 */
  }

  .react-calendar__navigation {
    display: flex;
    justify-content: space-between;
    border-radius: 20px 20px 0 0;
    height: 50px;
    background: transparent; /* 배경 투명 */
    margin-bottom: 20px;
    padding: 0 10px;
  }

  .react-calendar__navigation__label {
    font-size: 1.2rem;
    font-weight: 600;
    color: #353c4e;
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

  .custom-icon {
    position: absolute;
    top: 70%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30px;
    height: 30px;
    pointer-events: none;
  }
`;

const ScheduleList = styled.div`
  width: 100%;
  margin-top: 20px;
`;

const ScheduleItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 15px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* 입체감 추가 */
  background-color: #fff; /* 흰색 배경 */
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px); /* 호버 시 살짝 위로 이동 */
  }

  & > div {
    background-color: #ffebcd;
    border-radius: 10px;
    padding: 10px;
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* 아이콘 배경에 입체감 추가 */
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

  return (
    <div className="relative min-h-[100vh] flex flex-col bg-[#FFEC8A] overflow-hidden">
      <div className="absolute bottom-0 w-full bg-white shadow-lg rounded-t-2xl p-6 animate-slideUp">
        <div className="flex flex-col justify-center items-center mb-6">
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

        {selectedDate && detailedSchedules && (
          <ScheduleList>
            {detailedSchedules.dosageSchedules.length > 0 && (
              <div>
                {detailedSchedules.dosageSchedules.map((schedule) => (
                  <ScheduleItem key={schedule.dosageId}>
                    <div>
                      <FaPills className="text-purple-600" />
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
                    <div>
                      <FaRegTimesCircle className="text-red-600" />
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
                    <div>
                      <FaSchool className="text-yellow-600" />
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
                      <div>
                        <FaChalkboardTeacher className="text-green-600" />
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
        )}
      </div>
    </div>
  );
}
