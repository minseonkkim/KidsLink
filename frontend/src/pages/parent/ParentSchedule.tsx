import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import "moment/locale/ko"; // 한글 설정
import { getAllParentSchedules, getParentSchedules } from "../../api/schedule"; // API 함수 불러오기
import styled from "styled-components";
import 'react-calendar/dist/Calendar.css'; // react-calendar 기본 스타일

const StyledCalendar = styled(Calendar)`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .react-calendar {
    width: 80%; /* 너비 조정 */
    background-color: transparent;
    border: none;
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.125em;
    border-radius: 20px;
    box-shadow: none;
    margin: auto; /* 중앙 정렬 */
  }

  .react-calendar__navigation {
    display: flex;
    justify-content: space-between;
    border-radius: 20px 20px 0 0;
    height: 50px; /* 높이 조정 */
    background: none;
  }

  .react-calendar__navigation__label {
    font-size: 1.2rem; /* 글꼴 크기 조정 */
    font-weight: 600;
    color: #353c4e;
  }

  .react-calendar__navigation button:enabled:hover,
  .react-calendar__navigation button:enabled:focus {
    background-color: none;
  }

  .react-calendar__month-view__weekdays {
    font-size: 0.9rem; /* 글꼴 크기 조정 */
    font-weight: 700;
    color: #353c4e;
    text-align: center;
  }

  .react-calendar__tile {
    display: flex !important;
    flex-direction: column;
    align-items: center !important;
    justify-content: flex-start !important;
    width: 60px; /* 칸 너비 조정 */
    height: 60px; /* 칸 높이 조정 */
    margin: 2px; /* 간격 조정 */
    border-radius: 10px;
    background: transparent;
    position: relative;
    border: none;
    padding-top: 5px;
  }

  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus,
  .react-calendar__tile--active {
    background: #ffc0cb;
    border-radius: 10px;
  }

  .react-calendar__tile--now {
    background: #ffffa6;
    border-radius: 10px;
  }

  .react-calendar__tile--now:enabled:hover,
  .react-calendar__tile--now:enabled:focus {
    background: #ffc0cb;
    border-radius: 10px;
  }

  .custom-icon {
    margin-top: 5px;
    font-size: 1.5rem;
  }

  .react-calendar__tile > abbr {
    margin-bottom: auto;
  }
`;

const ParentSchedule: React.FC = () => {
  const [value, setValue] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(
    moment(value).format("YYYY-MM-DD")
  );
  const [schedules, setSchedules] = useState<string[]>([]);
  const [detailedSchedules, setDetailedSchedules] = useState<DetailedSchedule | null>(null);

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
      console.log(
        "Fetched detailed schedules for date:",
        date,
        detailedSchedule
      );
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

  const handleDateClick = (value: Date) => {
    const formattedDate = moment(value).format("YYYY-MM-DD");
    setSelectedDate(formattedDate);
    setValue(value);
  };

  const getActiveMonth = (activeStartDate: Date) => {
    const year = moment(activeStartDate).year();
    const month = moment(activeStartDate).month() + 1;
    fetchSchedules(year, month);
  };

  const addContent = ({ date }: { date: Date }) => {
    const dateString = moment(date).format("YYYY-MM-DD");
    const hasSchedule = schedules.includes(dateString);
    return hasSchedule ? <div className="custom-icon">😊</div> : null;
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#FFEC8A]">
      <div className="w-full h-screen mt-24 flex flex-col items-center">
        <div className="w-full h-full bg-white shadow-top px-5 rounded-t-2xl">
          <div className="flex flex-col justify-start items-center pt-4 bg-white">
            <div className="w-full relative overflow-hidden rounded-2xl">
              <StyledCalendar
                locale="ko"
                onChange={handleDateClick}
                value={value}
                next2Label={null}
                prev2Label={null}
                formatDay={(locale: string, date: Date) => moment(date).format("D")}
                tileContent={addContent}
                showNeighboringMonth={false}
                onActiveStartDateChange={({ activeStartDate }) => getActiveMonth(activeStartDate!)}
              />
            </div>
          </div>

          {selectedDate && detailedSchedules && (
            <div className="w-full p-4">
              {detailedSchedules.dosageSchedules.length > 0 && (
                <div>
                  <ul>
                    {detailedSchedules.dosageSchedules.map((schedule) => (
                      <div
                        key={schedule.dosageId}
                        className="flex flex-col p-4 rounded-2xl bg-[#FFF9D7] border border-[#FFEC8A] hover:bg-[#FFEC8A] transition-colors duration-200 cursor-pointer"
                      >
                        <p className="text-base font-bold text-[#757575]">
                          {`[투약] ${schedule.startDate} - ${schedule.endDate}`}
                        </p>
                        <p className="text-lg font-medium text-[#353c4e]">
                          {`${schedule.name} - ${schedule.volume}, ${schedule.times}, ${schedule.details}`}
                        </p>
                      </div>
                    ))}
                  </ul>
                </div>
              )}
              {detailedSchedules.absentSchedules.length > 0 && (
                <div>
                  <ul>
                    {detailedSchedules.absentSchedules.map((schedule) => (
                      <div
                        key={schedule.absentId}
                        className="flex flex-col p-4 rounded-2xl bg-[#FFF9D7] border border-[#FFEC8A] hover:bg-[#FFEC8A] transition-colors duration-200 cursor-pointer"
                      >
                        <p className="text-base font-bold text-[#757575]">
                          {`[결석] ${schedule.startDate} - ${schedule.endDate}`}
                        </p>
                        <p className="text-lg font-medium text-[#353c4e]">
                          {`${schedule.reason} - ${schedule.details}`}
                        </p>
                      </div>
                    ))}
                  </ul>
                </div>
              )}
              {detailedSchedules.kindergartenSchedules.length > 0 && (
                <div>
                  <ul>
                    {detailedSchedules.kindergartenSchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="flex flex-col p-4 rounded-2xl bg-[#FFF9D7] border border-[#FFEC8A] hover:bg-[#FFEC8A] transition-colors duration-200 cursor-pointer"
                      >
                        <p className="text-base font-bold text-[#757575]">
                          {schedule.date}
                        </p>
                        <p className="text-lg font-medium text-[#353c4e]">
                          {`[유치원] ${schedule.content}`}
                        </p>
                      </div>
                    ))}
                  </ul>
                </div>
              )}
              {detailedSchedules.meetingSchedules.length > 0 && (
                <div>
                  <ul>
                    {detailedSchedules.meetingSchedules.map((schedule) => (
                      <div
                        key={schedule.meetingId}
                        className="flex flex-col p-4 rounded-2xl bg-[#FFF9D7] border border-[#FFEC8A] hover:bg-[#FFEC8A] transition-colors duration-200 cursor-pointer"
                      >
                        <p className="text-base font-bold text-[#757575]">
                          {schedule.meetingDate}
                        </p>
                        <p className="text-lg font-medium text-[#353c4e]">
                          {`[회의] ${schedule.meetingTime}`}
                        </p>
                      </div>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentSchedule;
