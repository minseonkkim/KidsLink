import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateRangePickerProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  isOpen: boolean;
  handleDateClick: () => void;
  handleDateChange: (update: [Date | null, Date | null]) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  isOpen,
  handleDateClick,
  handleDateChange,
}) => {
  return (
    <div className="relative">
      <div onClick={handleDateClick} className="p-2 border rounded w-full cursor-pointer">
        {startDate && endDate ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}` : '시작 날짜 - 종료 날짜'}
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
            onClickOutside={handleDateClick}
            className="datepicker-custom"
          />
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
