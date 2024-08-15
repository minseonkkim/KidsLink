import { useState } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import "moment/locale/ko";
import styled from "styled-components";
import daramgi from "../../../assets/parent/cute-daramgi.png"

interface CustomCalendarProps {
  schedules: string[];
  onDateClick: (date: Date) => void;
  onMonthChange: (year: number, month: number) => void;
}

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

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  schedules,
  onDateClick,
  onMonthChange,
}) => {
  const [value, setValue] = useState<Date>(new Date());

  const handleDateClick = (date: Date) => {
    setValue(date);
    onDateClick(date);
  };

  const getActiveMonth = (activeStartDate: Date) => {
    const year = moment(activeStartDate).year();
    const month = moment(activeStartDate).month() + 1;
    onMonthChange(year, month);
  };

  const addContent = ({ date }: { date: Date }) => {
    const dateString = moment(date).format("YYYY-MM-DD");
    const hasSchedule = schedules.includes(dateString);
    return hasSchedule ? (
      <img src={daramgi} alt="daramgi" className="custom-icon" />
    ) : null;
  };

  return (
    <CalendarContainer>
      <StyledCalendar
        locale="ko"
        onChange={(date) => handleDateClick(date as Date)}
        value={value}
        next2Label={null}
        prev2Label={null}
        formatDay={(locale: string, date: Date) => moment(date).format("D")}
        tileContent={addContent}
        showNeighboringMonth={true}
        onActiveStartDateChange={({ activeStartDate }) =>
          getActiveMonth(activeStartDate!)
        }
      />
    </CalendarContainer>
  );
};

export default CustomCalendar;