import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import { FaRegCalendar } from "react-icons/fa6";
import NavigateBack from "../../components/teacher/common/NavigateBack";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import Title from "../../components/teacher/common/Title";
import ReservationTime from "../../components/teacher/consulting/ReservationTime";
import "./teacher-schedule.css";
import { PostTeacherReservations, TeacherMeetingReservation, getAllPossibleReservations } from "../../api/meeting";
import axiosInstance from "../../api/token/axiosInstance";

export default function TeacherReservation() {
  type ValuePiece = Date | null;
  const [date, setDate] = useState<ValuePiece>(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [tempSelectedTimes, setTempSelectedTimes] = useState<{ [key: string]: string[] }>({});
  const [reservations, setReservations] = useState<{ [key: string]: string[] }>({});
  const [fetchedReservations, setFetchedReservations] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const data = await getAllPossibleReservations();
      console.log("useEffect에서의 data");
      console.log(data);
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

  // 모든 시간 목록
  const allTimes = [
    "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"
  ];

  // 날짜 형식 변환
  const formatDate = (date: ValuePiece) => {
    if (date instanceof Date) {
      return moment(date).format("YYYY년 MM월 DD일");
    }
    return '';
  };

  // 날짜 변경 시 호출
  const handleDateChange = (date: ValuePiece) => {
    setDate(date);
    if (date instanceof Date) {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      setSelectedTimes(tempSelectedTimes[formattedDate] || reservations[formattedDate] || []);
    }
  };

  // 시간 클릭할 때
  const handleTimeClick = (time: string) => {
    if (!isEditing) return;
    if (date instanceof Date) {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      // 서버에서 가져온 시간은 수정 불가
      if (fetchedReservations[formattedDate]?.includes(time)) return;

      setSelectedTimes((prevTimes) =>
        prevTimes.includes(time) ? prevTimes.filter((t) => t !== time) : [...prevTimes, time]
      );
    }
  };

  // selectedTimes가 변경될 때 tempSelectedTimes 업데이트
  useEffect(() => {
    if (date instanceof Date) {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      // fetchedReservations에 있는 시간은 제외하고 tempSelectedTimes 설정
      const timesToSet = selectedTimes.filter(time => !fetchedReservations[formattedDate]?.includes(time));
      setTempSelectedTimes(prev => ({
        ...prev,
        [formattedDate]: timesToSet
      }));
    }
  }, [selectedTimes, date]);

  // 전체 선택/해제 버튼 클릭할 때
  const handleSelectAllClick = () => {
    if (selectedTimes.length === allTimes.length) {
      setSelectedTimes([]);
    } else {
      setSelectedTimes(allTimes);
    }
  };

  // 수정 모드 활성화
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // 수정 완료 버튼 클릭할 때 => POST
  const handleSaveClick = async () => {
    try {
      // 새로 추가된 예약 시간만 필터링
      const nonEmptyTempSelectedTimes = Object.fromEntries(
        Object.entries(tempSelectedTimes).filter(([key, value]) => value.length > 0)
      );

      // API 요청 데이터 준비
      const requestData: TeacherMeetingReservation[] = Object.entries(tempSelectedTimes).map(
        ([date, times]) => ({ date, times })
      );
      console.log("requestData");
      console.log(requestData);

      // API 호출
      await PostTeacherReservations(requestData);

      console.log('예약이 저장되었습니다:', requestData);

      // 최신 데이터 다시 가져오기
      await fetchData();

      // 상태 초기화 및 편집 모드 종료
      setTempSelectedTimes({});
      setIsEditing(false);
      setSelectedTimes([]);
    } catch (error) {
      console.error('예약을 저장하는 중 오류 발생:', error);
    }
  };

  return (
    <>
      <TeacherHeader />
      <div className="mt-[120px] px-[150px]">
        <NavigateBack backPage="화상상담" backLink='/meeting' />
        <Title title="상담가능시간 open" />

        <div className="flex flex-row justify-between mt-10">
          <Calendar 
            value={date}
            onChange={(value) => handleDateChange(value as Date)}
            formatDay={(locale: string, date: Date) => date.toLocaleString("en", {day: "numeric"})}
            next2Label={null}
            prev2Label={null}
          />

          <div className="w-[637px]">
            <div className="flex flex-row justify-between">
              <div className="text-[22px] flex flex-row items-center h-[22px] font-bold text-[#8CAD1E] my-5">
                <FaRegCalendar className="mr-3"/>
                {formatDate(date)}
              </div>
              <button 
                className="mt-2 h-[40px] border-2 border-[#7C7C7C] bg-[#E3EEFF] px-3 py-1 font-bold rounded-[10px] hover:bg-[#D4DDEA]"
                onClick={isEditing ? handleSaveClick : handleEditClick}
              >
                {isEditing ? '수정완료' : '수정하기'}
              </button>
            </div>
            <div className="flex justify-between">
              <div></div>
              {isEditing && 
              <label htmlFor="chk">
                <input type="checkbox" id="chk" onClick={handleSelectAllClick}/>
                <i className="circle mr-2"></i>
                <span className="text">{selectedTimes.length === allTimes.length ? "전체 해제" : "전체 선택"}</span>
              </label>}
              </div>
              <p className="mb-3 font-bold text-[18px]">오전</p>
              <div className="flex flex-row flex-wrap">
                {allTimes.slice(0, 6).map((time) => (
                  <ReservationTime 
                    key={time} 
                    time={time} 
                    isActive={selectedTimes.includes(time) || (reservations[date && moment(date).format("YYYY-MM-DD")]?.includes(time) || false)}
                    onClick={() => handleTimeClick(time)}
                  />
                ))}
              </div>
              <p className="mt-5 mb-3 font-bold text-[18px]">오후</p>
              <div className="flex flex-row flex-wrap">
                {allTimes.slice(6).map((time) => (
                  <ReservationTime 
                    key={time} 
                    time={time} 
                    isActive={selectedTimes.includes(time) || (reservations[date && moment(date).format("YYYY-MM-DD")]?.includes(time) || false)}
                    onClick={() => handleTimeClick(time)}
                  />
                ))}
              </div>
          </div>
        </div>
      </div>
    </>
  );
}
