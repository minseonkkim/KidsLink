import { TeacherMeetingScheduleProps } from "../../../types/meeting";

export default function TeacherMeetingSchedule({date, time, name, profileImgPath, isActivate}:TeacherMeetingScheduleProps){
    return <>
        <div className={`font-KoPubDotum w-[340px] h-[230px] m-[20px] ${isActivate? 'bg-gradient-to-br from-[#FFF9D7] to-[#D5E4B4]' : 'bg-[#f4f4f4]'} rounded-[20px] flex flex-col items-center justify-around p-5`}>
            <p className="text-[18px]">{date}</p>
            <p className="text-[18px]">{time}</p>
            <div className="flex flex-row items-center">
                <div className="w-[50px] h-[50px] mx-3">
                    <img src={profileImgPath} className="w-full h-full rounded-full object-cover"  />
                </div>
                <p className="font-bold text-[24px]">{name} 학부모</p>
            </div>
            <div>
                {isActivate && <button className="border-[2px] border-[#7C7C7C] bg-[#ffffff] px-3 py-1 font-bold rounded-[10px] hover:bg-[#F3F3F3]">입장하기</button>}
            </div>
            
        </div>
    </>
}