import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';

interface DateRangePickerProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  isOpen: boolean;
  handleDateClick: () => void;
  handleDateChange: (dates: [Date | null, Date | null]) => void;
}

// Styled Components for the DatePicker and its surrounding elements
const DatePickerWrapper = styled.div`
  .custom-calendar {
    background-color: #fff9d7; /* 달력 배경 색상 */
    border-color: #ffec8a; /* 달력 테두리 색상 */
    border-radius: 8px;
  }

  .react-datepicker__header {
    background-color: #ffec8a; /* 헤더 배경 색상 */
    border-bottom: 1px solid #ffec8a;
    color: #353c4e; /* 헤더 텍스트 색상 */
  }

  .react-datepicker__current-month,
  .react-datepicker__day-name {
    color: #353c4e; /* 현재 월과 요일 이름 색상 */
  }

  .react-datepicker__day {
    color: #353c4e; /* 날짜 기본 색상 */
  }

  .react-datepicker__day--disabled {
    color: #d1d5db; /* 비활성화된 날짜 색상 (회색) */
    pointer-events: none; /* 비활성화된 날짜 선택 불가 */
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--in-range,
  .react-datepicker__day--in-selecting-range {
    background-color: #ffec8a; /* 선택된 날짜 및 범위 배경 색상 */
    color: #212121; /* 선택된 날짜 텍스트 색상 */
  }

  .react-datepicker__day--keyboard-selected {
    background-color: #ffd700; /* 키보드로 선택된 날짜 배경 색상 */
    color: #212121; /* 키보드로 선택된 날짜 텍스트 색상 */
  }

  .react-datepicker__day:hover {
    background-color: #ffd700; /* 날짜 호버 배경 색상 */
    color: #212121; /* 날짜 호버 텍스트 색상 */
  }

  .react-datepicker__navigation--previous,
  .react-datepicker__navigation--next {
    border-color: #353c4e; /* 네비게이션 버튼 색상 */
  }
`;

const DateInputWrapper = styled.div`
  padding: 12px;
  border: 1px solid #d1d5db; /* border-gray-300 */
  border-radius: 8px;
  width: 100%;
  cursor: pointer;
  color: #4b5563; /* text-gray-700 */
  &:hover {
    background-color: #f3f4f6; /* hover:bg-gray-100 */
  }
`;

export default function DateRangePicker({
  startDate,
  endDate,
  isOpen,
  handleDateClick,
  handleDateChange,
}: DateRangePickerProps) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  return (
    <DatePickerWrapper className="relative">
      <DateInputWrapper onClick={handleDateClick}>
        {startDate && endDate ? (
          <span>{`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`}</span>
        ) : (
          <span className="text-gray-400">시작 날짜 - 종료 날짜</span>
        )}
      </DateInputWrapper>
      {isOpen && (
        <div className="absolute z-10 mt-2 rounded-lg shadow-lg">
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
            minDate={today}
            onClickOutside={handleDateClick}
            className="datepicker-custom"
            calendarClassName="custom-calendar"
            dayClassName={(date) =>
              date < yesterday ? "react-datepicker__day--disabled" : "text-gray-900"
            }
          />
        </div>
      )}
    </DatePickerWrapper>
  );
}
