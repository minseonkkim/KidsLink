import moment from 'moment';
import ReservationTime from '../consulting/ReservationTime';
import StyledCalendar from '../common/StyledCalendar';
import { FaRegCalendar } from "react-icons/fa6";
import { formatDate } from '../../../utils/meeting';

export default function FirstStep() {
  const date = new Date();
  const allTimes = [
    '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  ];

  return (
    <div className="w-full py-3"> 
    <div className="dark-overlay"></div>
      <div className="w-full mt-10 mb-32 flex flex-col lg:flex-row lg:justify-between">
        <div className="w-full lg:w-[665px] lg:mr-4">
          <StyledCalendar
            value={date}
            formatDay={(locale: string, date: Date) => date.toLocaleString('en', { day: 'numeric' })}
            next2Label={null}
            prev2Label={null}
            tileDisabled={({ date, view }) => view === 'month' && moment(date).isBefore(new Date())}
          />
        </div>

        <div className="w-full ml-[23px] lg:my-0 my-7">
          <div className="flex flex-row justify-between items-center mb-4">
            <div className="lg:text-[22px] text-[20px] flex flex-row items-center font-bold text-[#8CAD1E]">
              <FaRegCalendar className="lg:mr-3 mr-1" />
              {formatDate(date)}
            </div>
            <button
              className="mr-[24px] mt-2 h-[40px] border-2 border-[#7C7C7C] bg-[#E3EEFF] px-3 py-1 font-bold rounded-[10px] hover:bg-[#D4DDEA] flex items-center"
            >
              <span>OPEN</span>
            </button>
          </div>

          <div className="flex justify-between mr-[20px]">
            <div></div>
            <label htmlFor="chk">
              <input type="checkbox" id="chk" />
              <i className="circle mr-2"></i>
              <span className="text">전체 선택</span>
            </label>
          </div>

          <p className="mb-3 font-bold text-[18px]">오전</p>
          <div className="flex flex-wrap">
            {allTimes.slice(0, 6).map((time) => (
              <ReservationTime key={time} time={time} date={date} isActive={false} isFetched={false} />
            ))}
          </div>
          <p className="mt-5 mb-3 font-bold text-[18px]">오후</p>
          <div className="flex flex-wrap">
            {allTimes.slice(6).map((time) => (
              <ReservationTime key={time} time={time} date={date} isActive={false} isFetched={false} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
