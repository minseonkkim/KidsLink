import { useState, useEffect } from "react"
import Calendar from "react-calendar"
import moment from "moment"
import "moment/locale/ko"
import { getAllParentSchedules, getParentSchedules } from "../../api/schedule"
import styled from "styled-components"
import {
  FaPills,
  FaRegTimesCircle,
  FaSchool,
  FaChalkboardTeacher,
} from "react-icons/fa"
import "react-calendar/dist/Calendar.css"

const StyledCalendar = styled(Calendar)`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .react-calendar {
    width: 100% !important; /* 너비 조정 */
    background-color: transparent !important;
    border-width: 0;

    font-family: Arial, Helvetica, sans-serif !important;
    box-shadow: none !important;
  }

  .react-calendar__navigation {
    display: flex;
    justify-content: space-between;
    border-radius: 20px 20px 0 0;
    height: 50px;
    background: none;
    margin-bottom: 20px;
  }

  .react-calendar__navigation__label {
    font-size: 1.2rem;
    font-weight: 600;
    color: #353c4e;
  }

  .react-calendar__navigation button:enabled:hover,
  .react-calendar__navigation button:enabled:focus {
    background-color: none;
  }

  .react-calendar__month-view__weekdays {
    display: flex;
    flex-wrap: wrap; /* 주중 이름이 7일로 래핑되도록 설정 */
  }

  .react-calendar__month-view__weekdays__weekday {
    flex: 0 0 14.2857%; /* 7일을 위한 비율 설정 */
    text-align: center;
  }

  .react-calendar__month-view__days {
    display: flex;
    flex-wrap: wrap; /* 날짜가 7일 기준으로 래핑되도록 설정 */
  }

  .react-calendar__month-view__days__day {
    flex: 0 0 14.2857%; /* 7일을 위한 비율 설정 */
    align-items: center;
    justify-content: center;
    padding: 5px;
    padding-bottom: 30px;
    position: relative; /* 아이콘 위치 설정에 필요 */
  }

  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus,
  .react-calendar__tile--active {
    background: #ffc0cb;
    border-radius: 10px;
  }

  .react-calendar__tile--now {
    background: #ffffa6;
    border-radius: 10px;
    color: black;
  }

  .react-calendar__tile--now:enabled:hover,
  .react-calendar__tile--now:enabled:focus {
    background: #ffc0cb;
    border-radius: 10px;
  }

  .react-calendar__tile > abbr {
    margin-bottom: auto;
  }

  .react-calendar__month-view__days__day--neighboringMonth {
    color: #b0b0b0;
  }

  .custom-icon {
    position: absolute;
    top: 70%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1rem; /* 아이콘 크기 조절 */
  }
`;

interface DosageSchedule {
  dosageId: number;
  startDate: string;
  endDate: string;
  name: string;
  volume: string;
  times: string;
  details: string;
}

interface AbsentSchedule {
  absentId: number;
  startDate: string;
  endDate: string;
  reason: string;
  details: string;
}

interface KindergartenSchedule {
  id: number;
  date: string;
  content: string;
}

interface MeetingSchedule {
  meetingId: number;
  meetingDate: string;
  meetingTime: string;
}

interface DetailedSchedule {
  dosageSchedules: DosageSchedule[];
  absentSchedules: AbsentSchedule[];
  kindergartenSchedules: KindergartenSchedule[];
  meetingSchedules: MeetingSchedule[];
}

export default function ParentSchedule() {
  const [value, setValue] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(
    moment(value).format("YYYY-MM-DD")
  );
  const [schedules, setSchedules] = useState<string[]>([]);
  const [detailedSchedules, setDetailedSchedules] =
    useState<DetailedSchedule | null>(null);

  const fetchSchedules = async (year: number, month: number) => {
    try {
      const fetchedSchedules = await getAllParentSchedules(year, month);
      setSchedules(fetchedSchedules);
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
    }
  };

  const fetchDetailedSchedules = async (date: string) => {
    try {
      const detailedSchedule = await getParentSchedules(date);
      setDetailedSchedules(detailedSchedule);
    } catch (error) {
      console.error("Failed to fetch detailed schedule:", error);
    }
  };

  useEffect(() => {
    const current = value;
    const year = moment(current).year();
    const month = moment(current).month() + 1;
    fetchSchedules(year, month);
    fetchDetailedSchedules(moment(current).format("YYYY-MM-DD"));
  }, [value]);

  useEffect(() => {
    if (selectedDate) {
      fetchDetailedSchedules(selectedDate);
    }
  }, [selectedDate]);

  const handleDateClick = (date: Date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    setSelectedDate(formattedDate);
    setValue(value);
  };

  const getActiveMonth = (activeStartDate: Date) => {
    const year = moment(activeStartDate).year();
    const month = moment(activeStartDate).month() + 1;
    fetchSchedules(year, month);
  };

  const addContent = ({ date }: { date: Date }) => {
    const dateString = moment(date).format("YYYY-MM-DD");
    const hasSchedule = schedules.includes(dateString);
    return hasSchedule ? <div className="custom-icon">😊</div> : null;
  };

  return (
    <div className="relative min-h-[100dvh] flex flex-col bg-[#FFEC8A] overflow-hidden">
      <div className="absolute bottom-0 h-[80%] flex flex-col w-full bg-white shadow-top rounded-tl-[20px] rounded-tr-[20px] pt-12 animate-slideUp">
        <div className="flex flex-col justify-center items-center">
          <div
            className="w-full relative overflow-hidden rounded-2xl"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <StyledCalendar
              locale="ko"
              onChange={(date) => handleDateClick(date as Date)}
              value={value}
              next2Label={null}
              prev2Label={null}
              formatDay={(locale: string, date: Date) =>
                moment(date).format("D")
              }
              tileContent={addContent}
              showNeighboringMonth={true}
              onActiveStartDateChange={({ activeStartDate }) =>
                getActiveMonth(activeStartDate!)
              }
            />
          </div>
        </div>

        {selectedDate && detailedSchedules && (
          <div className="w-full py-8 px-8 overflow-y-auto">
            {detailedSchedules.dosageSchedules.length > 0 && (
              <div>
                {detailedSchedules.dosageSchedules.map((schedule) => (
                  <div
                    key={schedule.dosageId}
                    className="flex items-center px-4 py-2 rounded-2xl gap-4"
                  >
                    <div className="flex items-center gap-2 bg-[#E7DFFF] rounded-xl py-2 px-4">
                      <FaPills className="text-purple-600" />
                      <span>투약</span>
                    </div>
                    <p>{schedule.name}</p>
                  </div>
                ))}
              </div>
            )}
            {detailedSchedules.absentSchedules.length > 0 && (
              <div>
                {detailedSchedules.absentSchedules.map((schedule) => (
                  <div
                    key={schedule.absentId}
                    className="flex items-center px-4 py-3 rounded-2xl gap-4"
                  >
                    <div className="flex items-center gap-2 bg-[#FFDFDF] rounded-xl py-2 px-4">
                      <FaRegTimesCircle className="text-red-600" />
                      <span>결석</span>
                    </div>
                    <p>{schedule.reason}</p>
                  </div>
                ))}
              </div>
            )}
            {detailedSchedules.kindergartenSchedules.length > 0 && (
              <div>
                {detailedSchedules.kindergartenSchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex items-center px-4 py-3 rounded-2xl gap-4"
                  >
                    <div className="flex items-center gap-2 bg-[#FFF7CA] rounded-xl py-2 px-4">
                      <FaSchool className="text-yellow-600" />
                      <span>학사일정</span>
                    </div>
                    <p>{schedule.content}</p>
                  </div>
                ))}
              </div>
            )}
            {detailedSchedules.meetingSchedules.length > 0 && (
              <div>
                {detailedSchedules.meetingSchedules.map((schedule) => (
                  <div
                    key={schedule.meetingId}
                    className="flex items-center px-4 py-3 rounded-2xl gap-4"
                  >
                    <div className="flex items-center gap-2 bg-[#D5E4B4] rounded-xl py-2 px-4">
                      <FaChalkboardTeacher className="text-green-600" />
                      <span>상담</span>
                    </div>
                    <p>{schedule.meetingTime}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
