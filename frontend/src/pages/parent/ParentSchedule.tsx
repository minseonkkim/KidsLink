import { useEffect, useState } from 'react';
import CommonHeader from '../../components/parent/common/HomeHeader';
import Calendar from 'react-calendar';
import moment from 'moment';
import 'moment/locale/ko'; // 한글 설정
import './parent-schedule.css'; // 커스텀 CSS 파일
import { getAllParentSchedules } from '../../api/schedule'; // API 함수 불러오기

interface Schedule {
  date: string;
}

export default function ParentSchedule() {
  const [value, onChange] = useState(new Date()); // 초기값은 현재 날짜
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [activeMonth, setActiveMonth] = useState<string>(moment(value).format('YYYY-MM'));
  const [schedules, setSchedules] = useState<string[]>([]); // API로부터 가져온 일정 데이터

  const fetchSchedules = async (year: number, month: number) => {
    try {
      const fetchedSchedules = await getAllParentSchedules(year, month);
      setSchedules(fetchedSchedules); // 날짜 데이터로 변환하여 저장
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    }
  };

  useEffect(() => {
    const year = moment(value).year();
    const month = moment(value).month() + 1;
    fetchSchedules(year, month); // 초기 로드 시 데이터 가져오기
  }, []);

  const handleDateClick = (value: Date | Date[]) => {
    const date = Array.isArray(value) ? value[0] : value;
    setSelectedDate(moment(date).format('YYYY-MM-DD'));
    onChange(date);
  };

  const getActiveMonth = (activeStartDate: Date) => {
    const newActiveMonth = moment(activeStartDate).format('YYYY-MM');
    setActiveMonth(newActiveMonth);

    const year = moment(activeStartDate).year();
    const month = moment(activeStartDate).month() + 1;
    fetchSchedules(year, month); // 월 변경 시 데이터 가져오기
  };

  const addContent = ({ date }: { date: Date }) => {
    const dateString = moment(date).format('YYYY-MM-DD');
    const hasSchedule = schedules.includes(dateString);
    return hasSchedule ? <div className="custom-icon">😊</div> : null;
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center bg-[#FFEC8A]">
      <CommonHeader title="부모 일정" />
      <div className="w-full h-[807px] absolute left-0 top-[93px]">
        <div className="w-full h-full absolute left-0 top-0 rounded-tl-[20px] rounded-tr-[20px] bg-white parent-schedule-calendar-container" />
        <div className="flex flex-col justify-start items-center w-full h-[465px] absolute left-0 top-12 gap-2 px-1 py-2.5 bg-white">
          <div className="w-full h-full relative overflow-hidden rounded-[20px]">
            <Calendar
              locale="ko"
              onChange={handleDateClick}
              value={value}
              next2Label={null}
              prev2Label={null}
              formatDay={(locale: string, date) => moment(date).format('D')}
              tileContent={addContent}
              showNeighboringMonth={false}
              onActiveStartDateChange={({ activeStartDate }) => getActiveMonth(activeStartDate!)}
              className="parent-schedule-calendar"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
