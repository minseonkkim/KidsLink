import { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";

interface TitleProps {
    title: string;
    tooltipContent?: JSX.Element;
}

export default function Title({title, tooltipContent}: TitleProps){
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    const [isHovered, setIsHovered] = useState<boolean>(false);

    return (
        <div className="text-[28px] lg:text-[36px] font-bold text-center text-[#363636] mt-0 lg:mt-8 mb-5 flex flex-row justify-center items-center w-full">
            {title}
            <div 
                className={`relative ml-3 cursor-pointer ${!tooltipContent && 'hidden'}`}
                onMouseEnter={() => { setShowTooltip(true); setIsHovered(true); }}
                onMouseLeave={() => { setShowTooltip(false); setIsHovered(false); }}
            >
                <FaInfoCircle size={30} color={isHovered ? "#8CAD1E" : "#C0D290"}/>
                {showTooltip && (
                  <div className="absolute top-full left-0 mt-2 p-3 bg-white border border-gray-300 rounded shadow-lg z-10 text-sm">
                      {tooltipContent}
                  </div>
                )}
            </div>
        </div>
    );
}
