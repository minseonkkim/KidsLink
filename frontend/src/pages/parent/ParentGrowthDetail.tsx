import React, { useState } from 'react';

const ParentSchedule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const scheduleData: { [key: string]: { type: string; title: string }[] } = {
    '2024-07-01': [{ type: '투약', title: '감기약' }],
    '2024-07-02': [{ type: '결석', title: '불국사 견학' }],
    '2024-07-03': [{ type: '상담', title: '개나리반 교사와의 상담' }],
    // 추가 데이터
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <div className="w-[412px] h-[915px] relative overflow-hidden bg-[#ffec8a]">
      <div className="w-full h-[807px] absolute left-0 top-[93px]">
        <div
          className="w-full h-full absolute left-0 top-0 rounded-tl-[20px] rounded-tr-[20px] bg-white"
          style={{
            boxShadow:
              '0px 54px 55px 0 rgba(0,0,0,0.25), 0px -12px 30px 0 rgba(0,0,0,0.12), 0px 4px 6px 0 rgba(0,0,0,0.12), 0px 12px 13px 0 rgba(0,0,0,0.17), 0px -3px 5px 0 rgba(0,0,0,0.09)',
          }}
        />
        <div className="flex flex-col justify-start items-center w-full h-[465px] absolute left-0 top-12 gap-2 px-1 py-2.5 bg-white">
          <div className="flex justify-center items-center w-full relative gap-2.5 px-8 py-4">
            <svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              preserveAspectRatio="none"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="black"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="w-[277px] text-[28px] font-semibold text-center text-[#363636]">2024년 7월</p>
            <svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              preserveAspectRatio="none"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="black"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex flex-col justify-start items-start w-full gap-1">
            <div className="flex justify-center items-center w-full gap-[11px] px-8 py-2">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                <div key={day} className="flex justify-center items-center flex-grow relative gap-2.5 px-2 py-0.5">
                  <p className="text-lg font-medium text-left uppercase text-black">
                    {day}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-start items-start w-full">
              {[...Array(5)].map((_, weekIndex) => (
                <div key={weekIndex} className="flex justify-center items-center w-full gap-2.5 px-8 py-2.5">
                  {[...Array(7)].map((_, dayIndex) => {
                    const day = weekIndex * 7 + dayIndex;
                    const date = `2024-07-${String(day + 1).padStart(2, '0')}`;
                    const isSelected = selectedDate === date;
                    return (
                      <div
                        key={dayIndex}
                        className={`flex flex-col justify-center items-center flex-grow h-[42px] relative gap-2.5 p-2.5 rounded-full cursor-pointer ${isSelected ? 'bg-[#ffec8a] border-2 border-yellow-500' : ''}`}
                        onClick={() => handleDateClick(date)}
                      >
                        <p className={`text-[22px] font-medium text-center ${isSelected ? 'text-white' : 'text-black'}`}>
                          {day + 1}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute left-[51px] top-[539px]">
          {selectedDate && (
            <>
              {scheduleData[selectedDate]?.filter(item => item.type === '투약').length > 0 && (
                <div className="mb-3">
                  <p className="text-xl font-bold mb-2">투약</p>
                  {scheduleData[selectedDate].filter(item => item.type === '투약').map((item, index) => (
                    <div key={index} className="w-[284px] h-10 flex items-center mb-2">
                      <div className="w-[69px] h-10 rounded-[10px] bg-[#e7dfff]" />
                      <p className="w-[32.08px] h-[28.31px] absolute left-[18.16px] top-[6.15px] text-lg font-bold text-center text-[#363636]">
                        {item.type}
                      </p>
                      <p className="ml-4 text-xl font-medium text-left text-black">{item.title}</p>
                    </div>
                  ))}
                </div>
              )}
              {scheduleData[selectedDate]?.filter(item => item.type === '결석').length > 0 && (
                <div className="mb-3">
                  <p className="text-xl font-bold mb-2">결석</p>
                  {scheduleData[selectedDate].filter(item => item.type === '결석').map((item, index) => (
                    <div key={index} className="w-[284px] h-10 flex items-center mb-2">
                      <div className="w-[69px] h-10 rounded-[10px] bg-[#ffdfdf]" />
                      <p className="w-[32.08px] h-[28.31px] absolute left-[18.16px] top-[6.15px] text-lg font-bold text-center text-[#363636]">
                        {item.type}
                      </p>
                      <p className="ml-4 text-xl font-medium text-left text-black">{item.title}</p>
                    </div>
                  ))}
                </div>
              )}
              {scheduleData[selectedDate]?.filter(item => item.type === '상담').length > 0 && (
                <div className="mb-3">
                  <p className="text-xl font-bold mb-2">상담</p>
                  {scheduleData[selectedDate].filter(item => item.type === '상담').map((item, index) => (
                    <div key={index} className="w-[284px] h-10 flex items-center mb-2">
                      <div className="w-[69px] h-10 rounded-[10px] bg-[#d5e4b4]" />
                      <p className="w-[32.08px] h-[28.31px] absolute left-[18.16px] top-[6.15px] text-lg font-bold text-center text-[#363636]">
                        {item.type}
                      </p>
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
