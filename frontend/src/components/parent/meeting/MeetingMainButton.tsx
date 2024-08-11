import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface MeetingMainProps {
    title: string;
    description: string;
    link: string;
    image: string;
    imgWidth: number;
    imgTopLg: number;
    imgTopSm: number;
    imgLeftLg: number;
    imgLeftSm: number;
}

export default function MeetingMainButton({
    title,
    description,
    link,
    image,
    imgWidth,
    imgTopLg,
    imgTopSm,
    imgLeftLg,
    imgLeftSm
}: MeetingMainProps) {
    const [isLg, setIsLg] = useState(window.innerWidth >= 1024);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            setIsLg(window.innerWidth >= 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div
            onClick={() => navigate(link)}
            className={`relative transition-transform transform hover:scale-105 bg-[#f4f4f4] hover:bg-[#ececec] rounded-lg drop-shadow-md border-[#a2a2a2] p-7 ${isLg ? 'w-[240px] h-[240px]' : 'w-[280px] h-[130px]'} rounded-[20px] my-3 overflow-hidden cursor-pointer`}
        >
            <h2 className="text-[25px] text-[#363636] mb-4 font-bold relative z-10">{title}</h2>
            <img
                src={image}
                style={{
                    width: `${imgWidth}px`,
                    position: 'absolute',
                    top: isLg ? `${imgTopLg}px` : `${imgTopSm}px`,
                    left: isLg ? `${imgLeftLg}px` : `${imgLeftSm}px`,
                    opacity: 0.4
                }}
            />
        </div>
    );
}
