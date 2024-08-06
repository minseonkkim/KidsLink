import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import { FaRegCalendar } from "react-icons/fa6";
import NavigateBack from "../../components/teacher/common/NavigateBack";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import Title from "../../components/teacher/common/Title";
import ReservationTime from "../../components/teacher/consulting/ReservationTime";
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ToastNotification from "../../components/teacher/common/ToastNotification.tsx";
import { getAllPossibleReservations, PostTeacherReservations } from "../../api/meeting.ts";
import { TeacherMeetingReservation } from "../../types/meeting.ts";
import { formatDate, isPastDate, ValuePiece } from "../../utils/meeting.ts";

const StyledCalendar = styled(Calendar)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'font-KoPubDotum';
  width: 450px;
  padding: 30px;
  max-width: 100%;
  background-color: #fff;
  color: #222;
  border-width: 2px;
  border-radius: 10px;
  line-height: 1.125em;

  .react-calendar { 
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: 'font-KoPubDotum';
    width: 450px;
    padding: 30px;
    max-width: 100%;
    background-color: #fff;
    color: #222;
    border-width: 2px;
    border-radius: 10px;
    line-height: 1.125em;
  }

  .react-calendar__navigation__next-button--years,
  .react-calendar__navigation__prev-button--years {
    display: none;
  }

  /* 년-월 */
  .react-calendar__navigation {
    margin-bottom: 25px;
  }

  .react-calendar__navigation__label > span {
    color: #000;
    font-family: SUIT Variable;
    font-size: 20px;
    font-weight: bold;
    line-height: 140%;
    margin-left: 30px;
    margin-right: 30px;
  }

  .react-calendar__navigation__prev-button,
  .react-calendar__navigation__next-button {
    font-size: 25px;
  }

  .react-calendar__navigation__label:hover,
  .react-calendar__navigation__prev-button:hover,
  .react-calendar__navigation__next-button:hover {
    background-color: transparent;
    cursor: default;
  }

  /* 요일 */
  .react-calendar__month-view__weekdays__weekday {
    border-bottom: none;
    font-family: 'font-KoPubDotum';
    padding: 8px !important;
    color: #000;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .react-calendar__month-view__days__day {
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    width: 44px;
    height: 44px;
    text-align: center;
    margin: 0;
    padding: 0;
  }

  .react-calendar__month-view__weekdays {
    display: flex;
    justify-content: center;
  }

  /* 요일 밑줄 제거 */
  .react-calendar__month-view__weekdays abbr {
    text-decoration: none;
    font-weight: 800;
  }

  /* 이번 달 일자 */
  .react-calendar__tile {
    color: #000;
    font-size: 18px;
    font-weight: bold;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .react-calendar__tile--weekend {
    color: #000;
    font-size: 18px;
    font-weight: bold;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  /* 저번 달 & 다음 달 일자 */
  .react-calendar__month-view__days__day--neighboringMonth {
    font-family: 'font-KoPubDotum';
    color: #5F5F5F;
    font-size: 18px;
    font-weight: bold;
    width: 44px;
    height: 44px;
  }

  /* 날짜 사이 간격 */
  .react-calendar__tile {
    font-family: 'font-KoPubDotum';
    padding: 10px;
    margin-bottom: 12px;
    font-size: 17px;
    display: flex;
    justify-content: center;
  }

  .react-calendar__tile:hover {
    border-radius: 20%;
  }

  /* 오늘 날짜 */
  .react-calendar__tile--now {
    background-color: #f6f6f6;
    color: #363636;
    border-radius: 20%;
  }

  .react-calendar__tile--now:enabled:hover,
  .react-calendar__tile--now:enabled:focus {
    background-color: #f6f6f6;
    border-radius: 20%;
  }

  /* 선택된 날짜의 배경색 변경 */
  .react-calendar__tile--active {
    border: 2px solid #8CAD1E;
    background-color: #D2E591;
    color: #000000;
    border-radius: 20%;
  }

  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    border: 2px solid #8CAD1E;
    background-color: #D2E591;
    color: #000000;
    border-radius: 20%;
  }
`;

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

      await postTeacherReservations(requestData);

      console.log('예약이 저장되었습니다:', requestData);

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
      <ToastNotification />
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
                  <span>수정하기</span>
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
    </>
  );
}