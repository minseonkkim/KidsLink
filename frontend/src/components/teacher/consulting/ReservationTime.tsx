import React from "react";

interface ReservationTimeProps {
  time: string;
  isActive: boolean;
  isFetched: boolean;
  onClick: () => void;
}

export default function ReservationTime({ time, isActive, isFetched, onClick }: ReservationTimeProps) {
  return (
    <div 
    className={`font-KoPubDotum text-[18px] w-[90px] h-[46px] rounded-[10px] flex items-center justify-center mr-[20px] mb-4 
      ${isFetched ? 'bg-[#BFDC60]' : isActive ? 'bg-[#e8e8e8]' : 'bg-[#fff] border-[2px] cursor-pointer'}
    `}
      onClick={!isFetched ? onClick : undefined}
    >
      {time}
    </div>
  );
}
