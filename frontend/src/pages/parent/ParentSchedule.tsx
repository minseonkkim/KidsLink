import React, { useState } from 'react';
import ParentHeader from "../../components/parent/main/ParentHeader";
import Calendar from 'react-calendar';
import moment from 'moment';
import 'react-calendar/dist/Calendar.css';
import 'moment/locale/ko'; // 한글 설정
import './parent-schedule.css'; // 커스텀 CSS 파일

const ParentSchedule: React.FC = () => {
  const [value, onChange] = useState(new Date()); // 초기값은 현재 날짜
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [activeMonth, setActiveMonth] = useState(moment(value).format('YYYY-MM'));

  const scheduleData: { [key: string]: { type: string; title: string }[] } = {
    '2024-07-01': [{ type: '투약', title: '감기약' }, { type: '결석', title: '불국사 견학' }, { type: '상담', title: '개나리반 교사와의 상담' }],
    '2024-07-02': [{ type: '결석', title: '불국사 견학' }],
    '2024-07-03': [{ type: '상담', title: '개나리반 교사와의 상담' }],
    '2024-07-22': [{ type: '상담', title: '개나리반 교사와의 상담' }],
    // 추가 데이터
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(moment(date).format('YYYY-MM-DD'));
    onChange(date);
  };

  const getActiveMonth = (activeStartDate: Date) => {
    const newActiveMonth = moment(activeStartDate).format('YYYY-MM');
    setActiveMonth(newActiveMonth);
  };

  const addContent = ({ date }: { date: Date }) => {
    const dateString = moment(date).format('YYYY-MM-DD');
    return scheduleData[dateString] ? <div className="custom-icon">😊</div> : null;
  };

  return (
    <div className="w-[412px] h-[915px] relative overflow-hidden bg-[#ffec8a]">
      <ParentHeader />
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
              formatDay={(locale, date) => moment(date).format('D')}
              tileContent={addContent}
              showNeighboringMonth={false}
              onActiveStartDateChange={({ activeStartDate }) => getActiveMonth(activeStartDate!)}
              className="parent-schedule-calendar"
            />
          </div>
        </div>
        <div className="absolute left-[20px] top-[500px] w-[372px]"> {/* 간격을 줄이기 위해 top 조정 */}
          {selectedDate && (
            <>
              {scheduleData[selectedDate]?.filter(item => item.type === '투약').length > 0 && (
                <div className="mb-3">
                  {scheduleData[selectedDate].filter(item => item.type === '투약').map((item, index) => (
                    <div key={index} className="w-full flex items-center mb-2">
                      <div className="w-[69px] h-10 rounded-[10px] bg-[#e7dfff] flex justify-center items-center">
                        <p className="text-lg font-bold text-center text-[#363636]">
                          {item.type}
                        </p>
                      </div>
                      <p className="ml-4 text-xl font-medium text-left text-black">{item.title}</p>
                    </div>
                  ))}
                </div>
              )}
              {scheduleData[selectedDate]?.filter(item => item.type === '결석').length > 0 && (
                <div className="mb-3">
                  {scheduleData[selectedDate].filter(item => item.type === '결석').map((item, index) => (
                    <div key={index} className="w-full flex items-center mb-2">
                      <div className="w-[69px] h-10 rounded-[10px] bg-[#ffdfdf] flex justify-center items-center">
                        <p className="text-lg font-bold text-center text-[#363636]">
                          {item.type}
                        </p>
                      </div>
                      <p className="ml-4 text-xl font-medium text-left text-black">{item.title}</p>
                    </div>
                  ))}
                </div>
              )}
              {scheduleData[selectedDate]?.filter(item => item.type === '상담').length > 0 && (
                <div className="mb-3">
                  {scheduleData[selectedDate].filter(item => item.type === '상담').map((item, index) => (
                    <div key={index} className="w-full flex items-center mb-2">
                      <div className="w-[69px] h-10 rounded-[10px] bg-[#d5e4b4] flex justify-center items-center">
                        <p className="text-lg font-bold text-center text-[#363636]">
                          {item.type}
                        </p>
                      </div>
                      <p className="ml-4 text-xl font-medium text-left text-black">{item.title}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentSchedule;
