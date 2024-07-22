import { useState } from "react"; // Ensure React is imported
import NavigateBack from "../../components/teacher/common/NavigateBack";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import Title from "../../components/teacher/common/Title";
import Calendar from "react-calendar";
import moment from "moment";
import { FaRegCalendar } from "react-icons/fa6";
import ReservationTime from "../../components/teacher/consulting/ReservationTime";
import "./teacher-schedule.css";

export default function TeacherReservation() {
    type ValuePiece = Date | null;
    const [date, setDate] = useState<ValuePiece | [ValuePiece, ValuePiece]>(new Date());

    const formatDate = (date: ValuePiece | [ValuePiece, ValuePiece]) => {
        if (date instanceof Date) {
            return moment(date).format("YYYY년 MM월 DD일");
        } else if (Array.isArray(date) && date[0] instanceof Date) {
            return moment(date[0]).format("YYYY년 MM월 DD일");
        }
        return '';
    };

    return (
        <>
            <TeacherHeader />
            <div className="font-KoPubDotum px-[150px]">
                <NavigateBack backPage="화상상담" backLink='/meeting' />
                <Title title="상담가능시간 open" />
                <div className="flex flex-row justify-between mt-10">
                    <Calendar 
                        onChange={setDate} 
                        value={date} 
                        formatDay={(locale: any, date: Date) => date.toLocaleString("en", {day: "numeric"})}
                        next2Label={null}
                        prev2Label={null}
                    />
                    <div className="w-[637px]">
                        <div className="flex flex-row justify-between mb-2">
                            <div className="text-[22px] flex flex-row items-center h-[22px] font-bold text-[#8CAD1E] my-5">
                                <FaRegCalendar className="mr-3"/>
                                {formatDate(date)}
                            </div>
                            <button className="h-[40px] border-[2px] border-[#7C7C7C] bg-[#E3EEFF] px-3 py-1 font-bold rounded-[10px] hover:bg-[#D4DDEA]">수정하기</button>
                        </div>
                        <p className="mb-3 font-bold text-[18px]">오전</p>
                        <div className="flex flex-row flex-wrap">
                            <ReservationTime time="9:00" isActive={false}/>
                            <ReservationTime time="9:30" isActive={true}/>
                            <ReservationTime time="10:00" isActive={false}/>
                            <ReservationTime time="10:30" isActive={false}/>
                            <ReservationTime time="11:00" isActive={false}/>
                            <ReservationTime time="11:30" isActive={false}/>
                        </div>
                        <p className="mt-5 mb-3 font-bold text-[18px]">오후</p>
                        <div className="flex flex-row flex-wrap">
                            <ReservationTime time="12:00" isActive={false}/>
                            <ReservationTime time="12:30" isActive={true}/>
                            <ReservationTime time="13:00" isActive={true}/>
                            <ReservationTime time="13:30" isActive={true}/>
                            <ReservationTime time="14:00" isActive={true}/>
                            <ReservationTime time="14:30" isActive={true}/>
                            <ReservationTime time="15:00" isActive={true}/>
                            <ReservationTime time="15:30" isActive={true}/>
                            <ReservationTime time="16:00" isActive={true}/>
                            <ReservationTime time="16:30" isActive={false}/>
                            <ReservationTime time="17:00" isActive={false}/>
                            <ReservationTime time="17:30" isActive={false}/>
                            <ReservationTime time="18:00" isActive={false}/>
                            <ReservationTime time="18:30" isActive={false}/>
                            <ReservationTime time="19:00" isActive={false}/>
                            <ReservationTime time="19:30" isActive={false}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
