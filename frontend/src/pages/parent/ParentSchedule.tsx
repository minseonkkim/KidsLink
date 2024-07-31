import { useEffect, useState } from "react";
import ParentHeader from "../../components/parent/common/HomeHeader";
import Calendar from "react-calendar";
import moment from "moment";
import "moment/locale/ko"; // 한글 설정
import "./parent-schedule.css"; // 커스텀 CSS 파일
import { getAllParentSchedules, getParentSchedules } from "../../api/schedule"; // API 함수 불러오기

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

interface AbsentSchedule {
  absentId: number;
  startDate: string;
  endDate: string;
  reason: string;
  details: string;
  confirmationStatus: string;
  childId: number;
  childName: string;
}

interface DosageSchedule {
  dosageId: number;
  startDate: string;
  endDate: string;
  name: string;
  volume: string;
  num: string;
  times: string;
  storageInfo: string;
  details: string;
  confirmationStatus: string;
  childId: number;
  childName: string;
}

interface DetailedSchedule {
  date: string;
  kindergartenSchedules: KindergartenSchedule[];
  meetingSchedules: MeetingSchedule[];
  absentSchedules: AbsentSchedule[];
  dosageSchedules: DosageSchedule[];
}

// Value 타입 정의
type Value = Date | [Date, Date];

// CalendarTileProperties 타입 정의
interface CalendarTileProperties {
  date: Date;
  view: string;
}

export default function ParentSchedule() {
  const [value, setValue] = useState<Value>(new Date()); // 초기값은 현재 날짜
  const [selectedDate, setSelectedDate] = useState<string | null>(
    moment(value instanceof Array ? value[0] : value).format("YYYY-MM-DD")
  );
  const [schedules, setSchedules] = useState<string[]>([]); // API로부터 가져온 일정 데이터
  const [detailedSchedules, setDetailedSchedules] =
    useState<DetailedSchedule | null>(null);

  const fetchSchedules = async (year: number, month: number) => {
    try {
      const fetchedSchedules = await getAllParentSchedules(year, month);
      setSchedules(fetchedSchedules); // 날짜 데이터로 변환하여 저장
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
    }
  };

  const fetchDetailedSchedules = async (date: string) => {
    try {
      const detailedSchedule = await getParentSchedules(date);
      setDetailedSchedules(detailedSchedule);
      console.log(
        "Fetched detailed schedules for date:",
        date,
        detailedSchedule
      );
    } catch (error) {
      console.error("Failed to fetch detailed schedule:", error);
    }
  };

  useEffect(() => {
    const current = value instanceof Array ? value[0] : value;
    const year = moment(current).year();
    const month = moment(current).month() + 1;
    fetchSchedules(year, month); // 초기 로드 시 데이터 가져오기
    fetchDetailedSchedules(moment(current).format("YYYY-MM-DD")); // 초기 로드 시 현재 날짜의 세부 일정 가져오기
  }, [value]);

  useEffect(() => {
    if (selectedDate) {
      fetchDetailedSchedules(selectedDate);
    }
  }, [selectedDate]);

  const handleDateClick = (value: Value) => {
    if (Array.isArray(value)) {
      // 필요시 범위 선택 처리
      return;
    }

    const formattedDate = moment(value).format("YYYY-MM-DD");
    setSelectedDate(formattedDate);
    setValue(value);
  };

  const getActiveMonth = (activeStartDate: Date) => {
    const year = moment(activeStartDate).year();
    const month = moment(activeStartDate).month() + 1;
    fetchSchedules(year, month); // 월 변경 시 데이터 가져오기
  };

  const addContent = ({ date }: CalendarTileProperties) => {
    const dateString = moment(date).format("YYYY-MM-DD");
    const hasSchedule = schedules.includes(dateString);
    return hasSchedule ? <div className="custom-icon">😊</div> : null;
  };

  return (
    <div className="min-h-[100vh] flex flex-col items-center bg-[#FFEC8A]">
      <ParentHeader />
      <div className="w-full h-[100vh] mt-24 flex flex-col items-center">
        <div className="w-full h-full bg-white shadow-top px-5 rounded-tl-[20px] rounded-tr-[20px]">
          <div className="flex flex-col justify-start items-center pt-4 bg-white">
            <div className="w-full relative overflow-hidden rounded-[20px]">
              <Calendar
                locale="ko"
                onChange={handleDateClick}
                value={value}
                next2Label={null}
                prev2Label={null}
                formatDay={(locale: string, date: Date) =>
                  moment(date).format("D")
                }
                tileContent={addContent}
                showNeighboringMonth={false}
                onActiveStartDateChange={({ activeStartDate }) =>
                  getActiveMonth(activeStartDate!)
                }
                className="parent-schedule-calendar"
              />
            </div>
          </div>

          {selectedDate && detailedSchedules && (
            <div className="w-full p-4">
              {detailedSchedules.dosageSchedules.length > 0 && (
                <div>
                  <ul>
                    {detailedSchedules.dosageSchedules.map((schedule) => (
                      <div
                        key={schedule.dosageId}
                        className="flex flex-col p-4 rounded-2xl bg-[#FFF9D7] border-1 border-[#FFEC8A] hover:bg-[#FFEC8A] transition-colors duration-200 cursor-pointer"
                      >
                        <p className="text-base font-bold text-[#757575]">
                          {`[투약] ${schedule.startDate} - ${schedule.endDate}`}
                        </p>
                        <p className="text-lg font-medium text-[#353c4e]">
                          {`${schedule.name} - ${schedule.volume}, ${schedule.times}, ${schedule.details}`}
                        </p>
                      </div>
                    ))}
                  </ul>
                </div>
              )}
              {detailedSchedules.absentSchedules.length > 0 && (
                <div>
                  <ul>
                    {detailedSchedules.absentSchedules.map((schedule) => (
                      <div
                        key={schedule.absentId}
                        className="flex flex-col p-4 rounded-2xl bg-[#FFF9D7] border-1 border-[#FFEC8A] hover:bg-[#FFEC8A] transition-colors duration-200 cursor-pointer"
                      >
                        <p className="text-base font-bold text-[#757575]">
                          {`[결석] ${schedule.startDate} - ${schedule.endDate}`}
                        </p>
                        <p className="text-lg font-medium text-[#353c4e]">
                          {`${schedule.reason} - ${schedule.details}`}
                        </p>
                      </div>
                    ))}
                  </ul>
                </div>
              )}
              {detailedSchedules.kindergartenSchedules.length > 0 && (
                <div>
                  <ul>
                    {detailedSchedules.kindergartenSchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="flex flex-col p-4 rounded-2xl bg-[#FFF9D7] border-1 border-[#FFEC8A] hover:bg-[#FFEC8A] transition-colors duration-200 cursor-pointer"
                      >
                        <p className="text-base font-bold text-[#757575]">
                          {schedule.date}
                        </p>
                        <p className="text-lg font-medium text-[#353c4e]">
                          {`[유치원] ${schedule.content}`}
                        </p>
                      </div>
                    ))}
                  </ul>
                </div>
              )}

              {detailedSchedules.meetingSchedules.length > 0 && (
                <div>
                  <ul>
                    {detailedSchedules.meetingSchedules.map((schedule) => (
                      <div
                        key={schedule.meetingId}
                        className="flex flex-col p-4 rounded-2xl bg-[#FFF9D7] border-1 border-[#FFEC8A] hover:bg-[#FFEC8A] transition-colors duration-200 cursor-pointer"
                      >
                        <p className="text-base font-bold text-[#757575]">
                          {schedule.meetingDate}
                        </p>
                        <p className="text-lg font-medium text-[#353c4e]">
                          {`[회의] ${schedule.meetingTime}`}
                        </p>
                      </div>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
