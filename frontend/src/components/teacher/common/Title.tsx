import { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

interface Tab {
    label: string;
    link: string;
}

interface TitleProps {
    title: string;
    tooltipContent?: JSX.Element;
    tabs?: Tab[]; // Adding the optional tabs prop
}

export default function Title({ title, tooltipContent, tabs }: TitleProps) {
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const location = useLocation();

    return (
        <div className="w-full flex flex-col lg:flex-row items-center justify-center mt-0 lg:mt-8 mb-5">
            <div className="flex items-center">
                <div className="text-[28px] lg:text-[36px] font-bold text-center text-[#363636] flex flex-row justify-center items-center">
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
            </div>
            {tabs && tabs.length > 0 && (
                <div className="flex flex-wrap justify-center lg:justify-start lg:ml-8 mt-4 lg:mt-0">
                    {tabs.map((tab, index) => {
                        const isActive = location.pathname === tab.link;
                        return (
                            <Link
                                key={index}
                                to={tab.link}
                                className={`mx-2 px-5 py-1.5 rounded-full ${
                                    isActive ? 'bg-[#8CAD1E] text-white' : 'bg-gray-200 text-gray-700'
                                } hover:bg-[#8CAD1E] hover:text-white transition duration-300 text-[17px]`}
                            >
                                {tab.label}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
