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
      className={`font-KoPubDotum text-[18px] w-[90px] h-[46px] rounded-[10px] flex items-center justify-center mr-4 mb-4 
        ${isFetched ? 'bg-[#efefef]' : 'cursor-pointer'} 
        ${isActive ? 'bg-[#bfdc62]' : 'bg-[#fff] border-[2px]'}
      `}
      onClick={!isFetched ? onClick : undefined}
    >
      {time}
    </div>
  );
}
