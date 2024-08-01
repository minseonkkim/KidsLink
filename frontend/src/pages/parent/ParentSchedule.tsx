import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import moment from 'moment';
import 'moment/locale/ko'; // 한글 설정
import { getAllParentSchedules, getParentSchedules } from '../../api/schedule'; // API 함수 불러오기
import styled from 'styled-components';

const StyledCalendar = styled(Calendar)`
    * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .parent-schedule-calendar {
    padding: 0 !important;
    margin: 0 !important;
  }

  .parent-schedule-calendar-container {
    padding: 0 !important;
    margin: 0 !important;
  }

  /* Reset margin and padding for calendar tiles */
  .react-calendar__tile,
  .react-calendar__tile--active,
  .react-calendar__tile--range,
  .react-calendar__tile--rangeStart,
  .react-calendar__tile--rangeEnd,
  .react-calendar__tile--rangeBothEnds,
  .react-calendar__month-view__days__day {
    margin: 5px 0px !important; /* Override any default margin */
    padding: 3px 0px !important; /* Override any default padding */
    box-sizing: border-box; /* Ensure padding does not affect the element's size */
  }

  /* Additional custom styles */
  .react-calendar__tile {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 100px; /* Adjust as needed */
    height: 100px; /* Adjust as needed */
  }

  .react-datepicker {
    font-family: "Arial", sans-serif;
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--in-selecting-range,
  .react-datepicker__day--in-range {
    background-color: #ffec8a;
    border-radius: 50%;
  }

  .react-datepicker__day--selected:hover,
  .react-datepicker__day--in-selecting-range:hover,
  .react-datepicker__day--in-range:hover {
    background-color: #ffda6e;
  }

  .react-datepicker__day--keyboard-selected {
    outline: none;
    box-shadow: 0 0 0 2px #ffda6e;
  }

  .react-datepicker__input-container input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
  }

  .react-datepicker__day-name,
  .react-datepicker__day,
  .react-datepicker__time-name {
    width: 3.5rem; /* Increased width */
    line-height: 3.5rem; /* Increased line-height */
    font-size: 1.5rem; /* Adjusted font-size */
  }

  .react-datepicker__current-month,
  .react-datepicker-time__header,
  .react-datepicker-year-header {
    font-size: 1.2rem;
    color: #353c4e;
  }

  .react-datepicker__header {
    background-color: #fff9d7;
    border-bottom: none;
  }

  .react-datepicker__day:hover {
    background-color: #ffda6e;
    border-radius: 50%;
  }

  .react-datepicker__day--keyboard-selected {
    border: 2px solid #fdda6e; /* 키보드 선택 시 테두리 색상 */
  }

  /* Calendar 컨테이너 스타일 */
  .parent-schedule-calendar-container {
    box-shadow: 0px 54px 55px 0 rgba(0, 0, 0, 0.25),
      0px -12px 30px 0 rgba(0, 0, 0, 0.12), 0px 4px 6px 0 rgba(0, 0, 0, 0.12),
      0px 12px 13px 0 rgba(0, 0, 0, 0.17), 0px -3px 5px 0 rgba(0, 0, 0, 0.09);
  }

  /* 커스텀 캘린더 스타일 */
  .parent-schedule-calendar {
    width: 100%;
    max-width: 100%;
    background-color: #fffbf0;
    border: none;
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.125em;
    border-radius: 20px;
  }

  .parent-schedule-calendar__navigation {
    display: flex;
    justify-content: space-between;
    background: #ffc0cb; /* 핑크색 */
    border-bottom: none; /* 테두리 제거 */
    height: 90px;
    border-radius: 20px 20px 0 0;
  }

  .parent-schedule-calendar__navigation__label > span {
    font-size: 24px;
    font-weight: 600;
    color: #6f48eb;
  }

  .parent-schedule-calendar__navigation button:disabled {
    background-color: #ffc0cb; /* 핑크색 */
    border-radius: 20px 20px 0 0;
  }

  .parent-schedule-calendar__navigation button:enabled:hover,
  .parent-schedule-calendar__navigation button:enabled:focus {
    background-color: #ffc0cb; /* 핑크색 */
    border-radius: 20px 20px 0 0;
  }

  .parent-schedule-calendar__month-view {
    padding: 12px 32px;
  }

  .parent-schedule-calendar__month-view__weekdays {
    font-size: 18px;
    font-weight: 900;
    color: #6f48eb;
  }

  .parent-schedule-calendar__month-view__weekdays__weekday {
    text-transform: uppercase;
  }

  .react-calendar__tile {
    display: flex !important;
    align-items: flex-center !important; /* items-start 대신 flex-start 사용 */
    justify-content: flex-start !important; /* 왼쪽 정렬 */
    width: 90px;
    height: 90px;
    padding: 10px;
    border: none !important; /* 테두리 제거 */
  }

  .parent-schedule-calendar {
    padding: 0;
    margin: 0;
  }

  .parent-schedule-calendar__tile {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center; /* 높이 동일하게 유지 */
    align-items: center;
    position: relative;
  }

  .parent-schedule-calendar__tile .day-number {
    position: absolute;
    top: 20%;
    font-size: 1.5rem; /* Adjusted font-size */
  }

  .parent-schedule-calendar__tile .emoji {
    margin-top: 25px; /* 이모티콘과 숫자 사이의 간격 조정 */
    font-size: 1.5rem; /* Adjusted font-size */
  }

  .parent-schedule-calendar__tile:enabled:hover,
  .parent-schedule-calendar__tile:enabled:focus,
  .parent-schedule-calendar__tile--active {
    background: #ffc0cb; /* 핑크색 */
    border-radius: 14px;
    border: none; /* 테두리 제거 */
  }

  .parent-schedule-calendar__tile--now {
    background: #ffffa6;
    border-radius: 14px;
  }

  .parent-schedule-calendar__tile--now:enabled:hover,
  .parent-schedule-calendar__tile--now:enabled:focus {
    background: #ffc0cb; /* 핑크색 */
    border-radius: 14px;
  }

  .react-calendar__month-view__weekdays__weekday {
    margin: 0 !important;
    padding: 0 !important;
  }

  .react-calendar__tile--active {
    margin: 0;
    border: none !important; /* 테두리 제거 */
    background-color: #ffc0cb !important; /* 핑크색 */
    color: #000000;
    border-radius: 20%;
  }

  .react-calendar__tile--now {
    background-color: #ffffa6 !important;
  }

  .custom-icon {
    height: 30px;
    width: 24px;
  }

`;

interface KindergartenSchedule {
  id: number;
  content: string;
  date: string;
}

interface MeetingSchedule {
  meetingId: number;
  meetingDate: string;
  meetingTime: string;
  parentId: number;
  teacherId: number;
}

interface AbsentSchedule {
  absentId: number;
  startDate: string;
  endDate: string;
  reason: string;
  details: string;
  confirmationStatus: string;
  childId: number;
  childName: string;
}

interface DosageSchedule {
  dosageId: number;
  startDate: string;
  endDate: string;
  name: string;
  volume: string;
  num: string;
  times: string;
  storageInfo: string;
  details: string;
  confirmationStatus: string;
  childId: number;
  childName: string;
}

interface DetailedSchedule {
  date: string;
  kindergartenSchedules: KindergartenSchedule[];
  meetingSchedules: MeetingSchedule[];
  absentSchedules: AbsentSchedule[];
  dosageSchedules: DosageSchedule[];
}

type Value = Date | [Date, Date];

const ParentSchedule: React.FC = () => {
  const [value, setValue] = useState<Value>(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(
    moment(value instanceof Array ? value[0] : value).format('YYYY-MM-DD')
  );
  const [schedules, setSchedules] = useState<string[]>([]);
  const [detailedSchedules, setDetailedSchedules] =
    useState<DetailedSchedule | null>(null);

  const fetchSchedules = async (year: number, month: number) => {
    try {
      const fetchedSchedules = await getAllParentSchedules(year, month);
      setSchedules(fetchedSchedules);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    }
  };

  const fetchDetailedSchedules = async (date: string) => {
    try {
      const detailedSchedule = await getParentSchedules(date);
      setDetailedSchedules(detailedSchedule);
      console.log('Fetched detailed schedules for date:', date, detailedSchedule);
    } catch (error) {
      console.error('Failed to fetch detailed schedule:', error);
    }
  };

  useEffect(() => {
    const current = value instanceof Array ? value[0] : value;
    const year = moment(current).year();
    const month = moment(current).month() + 1;
    fetchSchedules(year, month);
    fetchDetailedSchedules(moment(current).format('YYYY-MM-DD'));
  }, [value]);

  useEffect(() => {
    if (selectedDate) {
      fetchDetailedSchedules(selectedDate);
    }
  }, [selectedDate]);

  const handleDateClick = (value: Value) => {
    if (Array.isArray(value)) {
      return;
    }

    const formattedDate = moment(value).format('YYYY-MM-DD');
    setSelectedDate(formattedDate);
    setValue(value);
  };

  const getActiveMonth = (activeStartDate: Date) => {
    const year = moment(activeStartDate).year();
    const month = moment(activeStartDate).month() + 1;
    fetchSchedules(year, month);
  };

  const addContent = ({ date }: { date: Date }) => {
    const dateString = moment(date).format('YYYY-MM-DD');
    const hasSchedule = schedules.includes(dateString);
    return hasSchedule ? <div className="custom-icon">😊</div> : null;
  };

  return (
    <div className="min-h-[100vh] flex flex-col items-center bg-[#FFEC8A]">
      <div className="w-full h-[100vh] mt-24 flex flex-col items-center">
        <div className="w-full h-full bg-white shadow-top px-5 rounded-tl-[20px] rounded-tr-[20px]">
          <div className="flex flex-col justify-start items-center pt-4 bg-white">
            <div className="w-full relative overflow-hidden rounded-[20px]">
              <StyledCalendar
                locale="ko"
                onChange={handleDateClick}
                value={value}
                next2Label={null}
                prev2Label={null}
                formatDay={(locale: string, date: Date) => moment(date).format('D')}
                tileContent={addContent}
                showNeighboringMonth={false}
                onActiveStartDateChange={({ activeStartDate }) =>
                  getActiveMonth(activeStartDate!)
                }
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
                        className="flex flex-col p-4 rounded-2xl bg-[#FFF9D7] border-1 border-[#FFEC8A] hover:bg-[#FFEC8A] transition-colors duration-200 cursor-pointer"
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
                        className="flex flex-col p-4 rounded-2xl bg-[#FFF9D7] border-1 border-[#FFEC8A] hover:bg-[#FFEC8A] transition-colors duration-200 cursor-pointer"
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
                        className="flex flex-col p-4 rounded-2xl bg-[#FFF9D7] border-1 border-[#FFEC8A] hover:bg-[#FFEC8A] transition-colors duration-200 cursor-pointer"
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
                        className="flex flex-col p-4 rounded-2xl bg-[#FFF9D7] border-1 border-[#FFEC8A] hover:bg-[#FFEC8A] transition-colors duration-200 cursor-pointer"
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
