import React from "react";
import moment from "moment";

interface ReservationTimeProps {
  time: string;
  isActive: boolean;
  isFetched: boolean;
  onClick: () => void;
  date: Date;
}

export default function ReservationTime({ time, isActive, isFetched, onClick, date }: ReservationTimeProps) {
  const currentTime = moment();
  const selectedTime = moment(`${moment(date).format("YYYY-MM-DD")} ${time}`, "YYYY-MM-DD HH:mm");

  const isWeekend = selectedTime.day() === 0 || selectedTime.day() === 6;
  const isPast = selectedTime.isBefore(currentTime);

  return (
    <div 
      className={`font-KoPubDotum text-[18px] w-[90px] h-[46px] rounded-[10px] flex items-center justify-center mr-[20px] mb-4 
        ${(isPast || isWeekend) ? 'bg-[#f4f4f4] text-[#525252] cursor-not-allowed' : isFetched ? 'bg-[#BFDC60] font-bold text-white' : isActive ? 'border-[#8CAD1E] border-[2px] text-[#8CAD1E] font-bold' : 'bg-[#fff] border-[2px] cursor-pointer'}
      `}
      onClick={!isFetched && !isPast && !isWeekend ? onClick : undefined}
    >
      {time}
    </div>
  );
}
