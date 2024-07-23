import Calendar from "react-calendar";
import NavigateBack from "../../components/teacher/common/NavigateBack";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import Title from "../../components/teacher/common/Title";
import { useState } from "react";
import moment from "moment";
import { FaRegCalendar } from "react-icons/fa6";

const scheduleItem = [
    {id: 1, content: "08:30 등원 및 인사", completed: true},
    {id: 2, content: "09:00 김여준 학부모 상담", completed: false},
    {id: 3, content: "10:00 블록놀이", completed: false},
]

export default function TeacherSchedule(){
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



    return <>
        <TeacherHeader/>
        <NavigateBack backPage="홈" backLink='/'/>
        <Title title="일정"/>
        <div className="px-[150px] mt-10 flex flex-row justify-between">
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
                        </div>
                        <div className="p-3 border-[2px] border-[#8CAD1E] rounded-[10px] h-[330px]">
                            {
                                scheduleItem.map(({id, content, completed}) => (
                                    <div key={id} className="flex flex-row m-2 items-center">
                                        <input 
                                            type="checkbox" 
                                            className="mr-2 w-[19px] h-[19px]" 
                                            checked={completed === true} 
                                        />
                                        <p className="text-[18px]">{content}</p>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="flex flex-row justify-between items-center mt-3">
                            <input className="border w-[150px] h-[40px] border-[2px] border-[#B8B8B8] mr-1 rounded-[10px] p-1" type="time"/>
                            <input className="border w-[580px] h-[40px] h-[40px] bg-[#F8F8F8] border-[2px] rounded-[10px] border-[#B8B8B8] mr-1 p-1"/>
                            <button className="font-bold border-[2px] border-[#B8B8B8] text-[#B8B8B8] w-[50px] h-[40px] rounded-[10px]">추가</button>
                        </div>
                        
                </div>
        </div>
    </>
}