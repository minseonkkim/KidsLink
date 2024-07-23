import { useState } from "react"
import Calendar from "react-calendar"
import moment from "moment"
import { FaRegCalendar } from "react-icons/fa6"
import NavigateBack from "../../components/teacher/common/NavigateBack"
import TeacherHeader from "../../components/teacher/common/TeacherHeader"
import Title from "../../components/teacher/common/Title"
import ReservationTime from "../../components/teacher/consulting/ReservationTime"
import "./teacher-schedule.css"


export default function TeacherReservation() {
    // 날짜 관리 state
    type ValuePiece = Date | null
    const [date, setDate] = useState<ValuePiece>(new Date())
    // 편집 관리 state
    const [isEditing, setIsEditing] = useState(false)
    // 시간 관리 state
    const [selectedTimes, setSelectedTimes] = useState<string[]>([])


    // 날짜 형식 변환
    const formatDate = (date: ValuePiece) => {
        if (date instanceof Date) {
            return moment(date).format("YYYY년 MM월 DD일")
        }
        return ''
    }

    // 수정하기 버튼 클릭할 때
    const handleEditClick = () => {
        setIsEditing(true)
    }
    // 시간 클릭할 때
    const handleTimeClick = (time: string) => {
        if (!isEditing) return;
        setSelectedTimes((prevTimes) =>
            prevTimes.includes(time) ? prevTimes.filter((t) => t !== time) : [...prevTimes, time]
        )
    }
    // 전체 선택/해제 버튼 클릭할 때
    const handleSelectAllClick = () => {
        if (selectedTimes.length === allTimes.length) {
            setSelectedTimes([])
        } else {
            setSelectedTimes(allTimes)
        }
    }
    // 수정 완료 버튼 클릭할 때 => POST
    const handleSaveClick = async () => {
        // => POST axios 추가
        setIsEditing(false)
        setSelectedTimes([])
    }

    // 모든 시간 목록
    const allTimes = [
        "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
        "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
        "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"
    ]

    return (
        <>
            <TeacherHeader />
            <div className="font-KoPubDotum px-[150px]">
                <NavigateBack backPage="화상상담" backLink='/meeting' />
                <Title title="상담가능시간 open" />

                <div className="flex flex-row justify-between mt-10">
                    <Calendar 
                        value={date}
                        onChange={(value) => setDate(value as Date)}
                        formatDay={(locale: any, date: Date) => date.toLocaleString("en", {day: "numeric"})}
                        next2Label={null}
                        prev2Label={null}
                    />

                    <div className="w-[637px]">
                        <div className="flex flex-row justify-between">
                            <div className="text-[22px] flex flex-row items-center h-[22px] font-bold text-[#8CAD1E] my-5">
                                <FaRegCalendar className="mr-3"/>
                                {formatDate(date)}
                            </div>
                            {isEditing ? (
                                <div>
                                    <button 
                                        className="mt-2 h-[40px] border-2 border-[#7C7C7C] bg-[#E3EEFF] px-3 py-1 font-bold rounded-[10px] hover:bg-[#D4DDEA]"
                                        onClick={handleSaveClick}
                                    >
                                        수정완료
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    className="mt-2 h-[40px] border-2 border-[#7C7C7C] bg-[#E3EEFF] px-3 py-1 font-bold rounded-[10px] hover:bg-[#D4DDEA]"
                                    onClick={handleEditClick}
                                >
                                    수정하기
                                </button>
                            )}
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
                                        isActive={selectedTimes.includes(time)}
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
                                    isActive={selectedTimes.includes(time)}
                                    onClick={() => handleTimeClick(time)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
