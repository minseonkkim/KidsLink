import { useEffect, useState } from 'react';
import CommonHeader from '../../components/parent/common/HomeHeader';
import Calendar from 'react-calendar';
import moment from 'moment';
import 'moment/locale/ko'; // 한글 설정
import './parent-schedule.css'; // 커스텀 CSS 파일
import { getAllParentSchedules, getParentSchedules } from '../../api/schedule'; // API 함수 불러오기

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

interface DetailedSchedule {
  date: string;
  kindergartenSchedules: KindergartenSchedule[];
  meetingSchedules: MeetingSchedule[];
  absentSchedules: any[]; // Replace with specific type if available
  dosageSchedules: any[]; // Replace with specific type if available
}

export default function ParentSchedule() {
  const [value, onChange] = useState(new Date()); // 초기값은 현재 날짜
  const [selectedDate, setSelectedDate] = useState<string | null>(moment(value).format('YYYY-MM-DD'));
  const [activeMonth, setActiveMonth] = useState<string>(moment(value).format('YYYY-MM'));
  const [schedules, setSchedules] = useState<string[]>([]); // API로부터 가져온 일정 데이터
  const [detailedSchedules, setDetailedSchedules] = useState<DetailedSchedule | null>(null);

  const fetchSchedules = async (year: number, month: number) => {
    try {
      const fetchedSchedules = await getAllParentSchedules(year, month);
      setSchedules(fetchedSchedules); // 날짜 데이터로 변환하여 저장
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    }
  };

  const fetchDetailedSchedules = async (date: string) => {
    try {
      const detailedSchedule = await getParentSchedules(date);
      setDetailedSchedules(detailedSchedule);
      console.log("detail-scheduless", detailedSchedules.kindergartenSchedules.length)
    } catch (error) {
      console.error('Failed to fetch detailed schedule:', error);
    }
  };

  useEffect(() => {
    const year = moment(value).year();
    const month = moment(value).month() + 1;
    fetchSchedules(year, month); // 초기 로드 시 데이터 가져오기
    fetchDetailedSchedules(moment(value).format('YYYY-MM-DD')); // 초기 로드 시 현재 날짜의 세부 일정 가져오기
  }, [value]);

  const handleDateClick = (date: Date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    setSelectedDate(formattedDate);
    onChange(date);
    fetchDetailedSchedules(formattedDate); // Fetch detailed schedules for the selected date
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
      {selectedDate && detailedSchedules && (
        <div className="w-full p-4 mt-16 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">{selectedDate} 일정</h3>
          {detailedSchedules.kindergartenSchedules.length > 0 && (
            <div>
              <h4 className="font-semibold">유치원 일정:</h4>
              <ul>
                {detailedSchedules.kindergartenSchedules.map((schedule) => (
                  <li key={schedule.id}>{schedule.content}</li>
                ))}
              </ul>
            </div>
          )}
          {detailedSchedules.meetingSchedules?.length > 0 && (
            <div>
              <h4 className="font-semibold">회의 일정:</h4>
              <ul>
                {detailedSchedules.meetingSchedules.map((schedule) => (
                  <li key={schedule.meetingId}>{`${schedule.meetingDate} ${schedule.meetingTime}`}</li>
                ))}
              </ul>
            </div>
          )}
          {detailedSchedules.absentSchedules?.length > 0 && (
            <div>
              <h4 className="font-semibold">결석 일정:</h4>
              <ul>
                {detailedSchedules.absentSchedules.map((schedule, index) => (
                  <li key={index}>결석</li>
                ))}
              </ul>
            </div>
          )}
          {detailedSchedules.dosageSchedules?.length > 0 && (
            <div>
              <h4 className="font-semibold">투약 일정:</h4>
              <ul>
                {detailedSchedules.dosageSchedules.map((schedule, index) => (
                  <li key={index}>투약</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
