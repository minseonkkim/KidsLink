interface ReservationTimeProps {
    time: string;
    isActive: boolean;
    onClick: () => void;
}

export default function ReservationTime({time, isActive, onClick}: ReservationTimeProps){
    return (
        <div 
            className={`${isActive? 'border-none !bg-[#bfdc62]' : 'border-[2px] bg-[#B8B8B8]'} font-KoPubDotum text-[18px] w-[90px] h-[46px] bg-[#fff] rounded-[10px] flex items-center justify-center mr-4 mb-4 cursor-pointer`}
            onClick={onClick}
        >
            {time}
        </div>
    )
}

