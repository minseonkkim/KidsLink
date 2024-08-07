import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import "moment/locale/ko"; // 한글 설정
import { getAllParentSchedules, getParentSchedules } from "../../api/schedule"; // API 함수 불러오기
import styled from "styled-components";
import 'react-calendar/dist/Calendar.css'; // react-calendar 기본 스타일

interface DosageSchedule {
  dosageId: number;
  startDate: string;
  endDate: string;
  name: string;
  volume: string;
  times: string;
  details: string;
}

interface AbsentSchedule {
  absentId: number;
  startDate: string;
  endDate: string;
  reason: string;
  details: string;
}

interface KindergartenSchedule {
  id: number;
  date: string;
  content: string;
}

interface MeetingSchedule {
  meetingId: number;
  meetingDate: string;
  meetingTime: string;
}

interface DetailedSchedule {
  dosageSchedules: DosageSchedule[];
  absentSchedules: AbsentSchedule[];
  kindergartenSchedules: KindergartenSchedule[];
  meetingSchedules: MeetingSchedule[];
}

const StyledCalendar = styled(Calendar)`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .react-calendar {
    width: 100% !important; /* 너비 조정 */
    background-color: transparent !important;
    border-width: 0;

    font-family: Arial, Helvetica, sans-serif !important;
    box-shadow: none !important;
  }

  .react-calendar__navigation {
    display: flex;
    justify-content: space-between;
    border-radius: 20px 20px 0 0;
    height: 50px;
    background: none;
    margin-bottom: 20px;
  }

  .react-calendar__navigation__label {
    font-size: 1.2rem;
    font-weight: 600;
    color: #353c4e;
  }

  .react-calendar__navigation button:enabled:hover,
  .react-calendar__navigation button:enabled:focus {
    background-color: none;
  }

  .react-calendar__month-view__weekdays {
    display: flex;
    flex-wrap: wrap; /* 주중 이름이 7일로 래핑되도록 설정 */
  }

  .react-calendar__month-view__weekdays__weekday {
    flex: 0 0 14.2857%; /* 7일을 위한 비율 설정 */
    text-align: center;
  }

  .react-calendar__month-view__days {
    display: flex;
    flex-wrap: wrap; /* 날짜가 7일 기준으로 래핑되도록 설정 */
  }

  .react-calendar__month-view__days__day {
    flex: 0 0 14.2857%; /* 7일을 위한 비율 설정 */
    align-items: center;
    justify-content: center;
    padding: 5px;
    padding-bottom: 30px;
    position: relative; /* 아이콘 위치 설정에 필요 */
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
    color: black;
  }

  .react-calendar__tile--now:enabled:hover,
  .react-calendar__tile--now:enabled:focus {
    background: #ffc0cb;
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
    top: 70%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1rem; /* 아이콘 크기 조절 */
  }
`;


export default function ParentSchedule() {
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

  const handleDateClick = (date: Date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
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
          <div className="flex flex-col justify-center items-center pt-4 bg-white pt-10">
            <div className="w-full relative overflow-hidden rounded-2xl"
            style={{ display: "flex", justifyContent: "center"  }}>
              <StyledCalendar
                locale="ko"
                onChange={(date) => handleDateClick(date as Date)}
                value={value}
                next2Label={null}
                prev2Label={null}
                formatDay={(locale: string, date: Date) => moment(date).format("D")}
                tileContent={addContent}
                showNeighboringMonth={true}
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
                          {`${schedule.name} - ${schedule.volume} - ${schedule.times}회`}
                        </p>
                        <p className="text-sm text-[#757575]">
                          {schedule.details}
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
