import { useState, useEffect } from "react";
import moment from "moment";
import { FaRegCalendar } from "react-icons/fa6";
import NavigateBack from "../../components/teacher/common/NavigateBack";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import Title from "../../components/teacher/common/Title";
import ReservationTime from "../../components/teacher/consulting/ReservationTime";
import { useNavigate } from 'react-router-dom';
import ToastNotification, { showToastSuccess } from "../../components/teacher/common/ToastNotification.tsx";
import { getAllPossibleReservations, postTeacherReservations } from "../../api/meeting.ts";
import { TeacherMeetingReservation } from "../../types/meeting.ts";
import { formatDate, isPastDate, ValuePiece } from "../../utils/meeting.ts";
import StyledCalendar from "../../components/teacher/common/StyledCalendar";

export default function TeacherReservation() {
  const [date, setDate] = useState<ValuePiece>(new Date());
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [tempSelectedTimes, setTempSelectedTimes] = useState<{ [key: string]: string[] }>({});
  const [reservations, setReservations] = useState<{ [key: string]: string[] }>({});
  const [fetchedReservations, setFetchedReservations] = useState<{ [key: string]: string[] }>({});
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [allFetched, setAllFetched] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (date instanceof Date) {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const times = tempSelectedTimes[formattedDate] || reservations[formattedDate] || [];
      setSelectedTimes(times);
      setSelectAll(times.length === allTimes.length); // Set select all checkbox state
      setAllFetched(fetchedReservations[formattedDate]?.length === allTimes.length); // Set all fetched state
    }
  }, [fetchedReservations]);

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
      setSelectAll(times.length === allTimes.length); // Set select all checkbox state
      setAllFetched(fetchedReservations[formattedDate]?.length === allTimes.length); // Set all fetched state
    }
  };

  const handleTimeClick = (time: string) => {
    if (date instanceof Date) {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      if (fetchedReservations[formattedDate]?.includes(time)) return;

      setSelectedTimes((prevTimes) =>
        prevTimes.includes(time) ? prevTimes.filter((t) => t !== time) : [...prevTimes, time]
      );
    }
  };

  useEffect(() => {
    if (date instanceof Date) {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const timesToSet = selectedTimes.filter(time => !fetchedReservations[formattedDate]?.includes(time));
      setTempSelectedTimes(prev => ({
        ...prev,
        [formattedDate]: timesToSet
      }));
      setSelectAll(timesToSet.length === allTimes.length); // Update select all checkbox state
    }
  }, [selectedTimes, date]);

  const handleSelectAllClick = () => {
    if (selectedTimes.length === allTimes.length) {
      setSelectedTimes([]);
      setSelectAll(false);
    } else {
      setSelectedTimes(allTimes);
      setSelectAll(true);
    }
  };

  const handleSubmitClick = async () => {
    try {
      const nonEmptyTempSelectedTimes = Object.fromEntries(
        Object.entries(tempSelectedTimes).filter(([key, value]) => value.length > 0)
      );
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
      console.log(requestData)
      await postTeacherReservations(requestData);

      console.log('예약이 저장되었습니다:', requestData);
      showToastSuccess(
        <div>
            예약이 저장되었습니다!<br />
        </div>
      );

      await fetchData();

      setTempSelectedTimes({});
      setSelectedTimes([]);
    } catch (error) {
      console.error('예약을 저장하는 중 오류 발생:', error);
    }
  };

  return (
    <>
      <TeacherHeader />
      <div className="mt-[130px] pl-[150px] pr-[130px]">
        <NavigateBack backPage="화상상담" backLink='/meeting' />
        <Title title="상담가능시간 open" />

        <div className="flex flex-row justify-between mt-10">
          <StyledCalendar
            value={date}
            onChange={(value) => handleDateChange(value as Date)}
            formatDay={(locale: string, date: Date) => date.toLocaleString("en", {day: "numeric"})}
            next2Label={null}
            prev2Label={null}
            tileDisabled={({ date, view }) => view === 'month' && isPastDate(date)}
          />

          <div className="w-[665px]">
            <div className="flex flex-row justify-between mr-[20px]">
              <div className="text-[22px] flex flex-row items-center h-[22px] font-bold text-[#8CAD1E] my-5">
                <FaRegCalendar className="mr-3"/>
                {formatDate(date)}
              </div>
              <button 
                  className="mt-2 h-[40px] border-2 border-[#7C7C7C] bg-[#E3EEFF] px-3 py-1 font-bold rounded-[10px] hover:bg-[#D4DDEA] flex items-center"
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
              <div className="flex flex-row flex-wrap">
                {allTimes.slice(0, 6).map((time) => {
                  const formattedDate = date && moment(date).format("YYYY-MM-DD");
                  const isFetched = fetchedReservations[formattedDate]?.includes(time) || false;
                  const isActive = selectedTimes.includes(time) || isFetched;

                  return (
                    <ReservationTime 
                      key={time} 
                      time={time} 
                      isActive={isActive}
                      isFetched={isFetched}
                      onClick={() => handleTimeClick(time)}
                    />
                  );
                })}
              </div>
              <p className="mt-5 mb-3 font-bold text-[18px]">오후</p>
              <div className="flex flex-row flex-wrap">
                {allTimes.slice(6).map((time) => {
                  const formattedDate = date && moment(date).format("YYYY-MM-DD");
                  const isFetched = fetchedReservations[formattedDate]?.includes(time) || false;
                  const isActive = selectedTimes.includes(time) || isFetched;

                  return (
                    <ReservationTime 
                      key={time} 
                      time={time} 
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
    </>
  );
}