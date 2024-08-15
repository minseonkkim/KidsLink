import { useState, useEffect } from "react";
import moment from "moment";
import { FaRegCalendar } from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";
import Title from "../../components/teacher/common/Title";
import ReservationTime from "../../components/teacher/consulting/ReservationTime";
import { useNavigate } from 'react-router-dom';
import ToastNotification, { showToastError, showToastSuccess } from "../../components/teacher/common/ToastNotification.tsx";
import { getAllPossibleReservations, postTeacherReservations } from "../../api/meeting.ts";
import { TeacherMeetingReservation } from "../../types/meeting.ts";
import { formatDate, isPastDate, ValuePiece } from "../../utils/meeting.ts";
import StyledCalendar from "../../components/teacher/common/StyledCalendar";
import TeacherLayout from '../../layouts/TeacherLayout';
import daramgi from "../../assets/teacher/meeting-daramgi.png"

export default function TeacherReservation() {
  const [date, setDate] = useState<ValuePiece>(new Date());
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [tempSelectedTimes, setTempSelectedTimes] = useState<{ [key: string]: string[] }>({});
  const [reservations, setReservations] = useState<{ [key: string]: string[] }>({});
  const [fetchedReservations, setFetchedReservations] = useState<{ [key: string]: string[] }>({});
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [allFetched, setAllFetched] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (date instanceof Date) {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const times = tempSelectedTimes[formattedDate] || reservations[formattedDate] || [];
      setSelectedTimes(times);
      updateAllFetchedStatus(formattedDate);
    }
  }, [date, fetchedReservations]);

  async function fetchData() {
    try {
      const data = await getAllPossibleReservations();
      const formattedData = data.reduce((acc, curr) => {
        const { date, time } = curr;
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(time);
        return acc;
      }, {});
      setReservations(formattedData);
      setFetchedReservations(formattedData);
    } catch (error) {
      console.error('예약 데이터를 가져오는 중 오류 발생:', error);
    }
  }

  const allTimes = [
    "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"
  ];

  const handleDateChange = (date: ValuePiece) => {
    setDate(date);
    if (date instanceof Date) {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const times = tempSelectedTimes[formattedDate] || reservations[formattedDate] || [];
      setSelectedTimes(times);
      updateAllFetchedStatus(formattedDate); // 전체 선택 상태 업데이트
    }
  };

  const handleTimeClick = (time: string) => {
    if (date instanceof Date) {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const currentTime = moment();
      const selectedTime = moment(`${formattedDate} ${time}`, 'YYYY-MM-DD HH:mm');

      if (selectedTime.isBefore(currentTime)) return; // 현재 시간보다 이전이면 클릭을 무시
      if (fetchedReservations[formattedDate]?.includes(time)) return;

      setSelectedTimes((prevTimes) =>
        prevTimes.includes(time) ? prevTimes.filter((t) => t !== time) : [...prevTimes, time]
      );

      setTempSelectedTimes(prev => ({
        ...prev,
        [formattedDate]: selectedTimes.includes(time)
          ? prev[formattedDate].filter(t => t !== time)
          : [...(prev[formattedDate] || []), time]
      }));
    }
  };

  const updateAllFetchedStatus = (formattedDate: string) => {
    const times = allTimes;
    const currentTime = moment();
    const selectedDate = moment(formattedDate, 'YYYY-MM-DD');
  
    const isWeekend = selectedDate.day() === 0 || selectedDate.day() === 6;
  
    const allTimesFetchedOrPast = times.every(time => {
      const selectedTime = moment(`${formattedDate} ${time}`, 'YYYY-MM-DD HH:mm');
      return fetchedReservations[formattedDate]?.includes(time) || selectedTime.isBefore(currentTime);
    });
  
    setAllFetched(allTimesFetchedOrPast || isWeekend); 
    setSelectAll(!allTimesFetchedOrPast && selectedTimes.length === times.length && !isWeekend); 
  };

  const handleSelectAllClick = () => {
    if (selectedTimes.length === allTimes.length) {
      setSelectedTimes([]);
      setSelectAll(false);
    } else {
      setSelectedTimes(allTimes);
      setSelectAll(true);

      const formattedDate = moment(date).format("YYYY-MM-DD");
      setTempSelectedTimes(prev => ({
        ...prev,
        [formattedDate]: allTimes
      }));
    }
  };

  const handleSubmitClick = async () => {
    try {
      const nonEmptyTempSelectedTimes = Object.fromEntries(
        Object.entries(tempSelectedTimes).filter(([key, value]) => value.length > 0)
      );
  
      // 선택된 시간이 없는 경우 에러 토스트 메시지 표시
      if (Object.keys(nonEmptyTempSelectedTimes).length === 0) {
        showToastError(
          <div>
            선택된 시간이 없습니다.<br />
            상담 가능 시간을 선택해주세요.
          </div>
        );
        return; // 함수를 종료하여 더 이상 진행하지 않도록 합니다.
      }
  
      const sortedTempSelectedTimes = Object.entries(nonEmptyTempSelectedTimes).reduce((acc, [date, times]) => {
        acc[date] = (times as string[]).sort((a, b) => {
          const timeA = moment(a, 'HH:mm');
          const timeB = moment(b, 'HH:mm');
          return timeA.diff(timeB);
        });
        return acc;
      }, {} as { [key: string]: string[] });
  
      const requestData: TeacherMeetingReservation[] = Object.entries(sortedTempSelectedTimes).map(
        ([date, times]) => ({ date, times })
      );
      await postTeacherReservations(requestData);
  
      showToastSuccess(
        <div>
          상담가능시간을 오픈했습니다!<br />
        </div>
      );
  
      await fetchData();
  
      setTempSelectedTimes({});
      setSelectedTimes([]);
    } catch (error) {
      console.error('예약을 저장하는 중 오류 발생:', error);
    }
  };

  const TooltipContent = (
    <div className="w-[270px]">
      <div className="text-start mb-3 leading-relaxed">학부모 상담이 가능한 시간을 선택해주세요. 해당 시간에 학부모가 상담 신청을 할 수 있어요.</div>
      <div>
        <div className="flex flex-row mb-2 items-center">
          <div className="bg-[#BFDC60] w-6 h-6 rounded-[4px] mr-2"></div>
          <div className="w-[160px] text-start text-[#818181]">이미 OPEN된 시간</div>
        </div>
        <div className="flex flex-row mb-2 items-center">
          <div className="bg-[#fff] border-[2px] border-[#8CAD1E] w-6 h-6 rounded-[4px] mr-2"></div>
          <div className="w-[160px] text-start text-[#818181]">선택한 시간</div>
        </div>
        <div className="flex flex-row items-center">
          <div className="bg-[#f4f4f4] w-6 h-6 rounded-[4px] mr-2"></div>
          <div className="w-[160px] text-start text-[#818181]">선택불가 (주말, 지난 시간)</div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { label: "상담가능시간 open", link: "/meeting/reservation" },
    { label: "상담시간 확정", link: "/meeting/confirm" },
    { label: "예약된 화상상담", link: "/meeting/scheduled" },
    { label: "녹화된 상담", link: "/meeting/recordings" },
];

return (
    <TeacherLayout
        activeMenu="meeting"
        setActiveMenu={() => {}}
        titleComponent={<Title title="상담가능시간 open" tooltipContent={TooltipContent} tabs={tabs} />}
        imageSrc={daramgi} 
    >
      <div className="px-5 py-1 lg:py-8">
        <div className="flex items-center">  
        </div>
        <div className="w-full mt-10 mb-32 flex flex-col lg:flex-row lg:justify-between">
          <div className="w-full lg:w-[665px] lg:mr-4">
            <StyledCalendar
              value={date}
              onChange={(value) => handleDateChange(value as Date)}
              formatDay={(locale: string, date: Date) => date.toLocaleString("en", { day: "numeric" })}
              next2Label={null}
              prev2Label={null}
              tileDisabled={({ date, view }) => view === 'month' && isPastDate(date)}
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
                onClick={handleSubmitClick}
              >
                <span>OPEN</span>
              </button>
            </div>
            {!allFetched && (
              <div className="flex justify-between mr-[20px]">
                  <div></div>
                  <label htmlFor="chk">
                    <input type="checkbox" id="chk" checked={selectAll} onChange={handleSelectAllClick}/>
                    <i className="circle mr-2"></i>
                    <span className="text">{selectAll ? "전체 해제" : "전체 선택"}</span>
                  </label>
              </div>
            )}

            <p className="mb-3 font-bold text-[18px]">오전</p>
            <div className="flex flex-wrap">
              {allTimes.slice(0, 6).map((time) => {
                const formattedDate = date && moment(date).format("YYYY-MM-DD");
                const isFetched = fetchedReservations[formattedDate]?.includes(time) || false;
                const isActive = selectedTimes.includes(time) || isFetched;

                return (
                  <ReservationTime 
                    key={time} 
                    time={time} 
                    date={date}
                    isActive={isActive}
                    isFetched={isFetched}
                    onClick={() => handleTimeClick(time)}
                  />
                );
              })}
            </div>
            <p className="mt-5 mb-3 font-bold text-[18px]">오후</p>
            <div className="flex flex-wrap">
              {allTimes.slice(6).map((time) => {
                const formattedDate = date && moment(date).format("YYYY-MM-DD");
                const isFetched = fetchedReservations[formattedDate]?.includes(time) || false;
                const isActive = selectedTimes.includes(time) || isFetched;

                return (
                  <ReservationTime 
                    key={time} 
                    time={time} 
                    date={date}
                    isActive={isActive}
                    isFetched={isFetched}
                    onClick={() => handleTimeClick(time)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <ToastNotification />
    </TeacherLayout>
  );
}
