import { Link } from "react-router-dom";

interface MeetingMainProps {
    title: string;
    description: string;
    link: string;
    image: string;
    imgWidth: number;
    imgTop: number;
    imgLeft: number;
}

export default function MeetingMainButton({
    title,
    description,
    link,
    image,
    imgWidth,
    imgTop,
    imgLeft
}: MeetingMainProps) {
    return (
        <Link to={link}>
            <div className="relative transition-transform transform hover:scale-105 bg-[#f4f4f4] rounded-lg drop-shadow-md border-[#a2a2a2] p-7 mx-6 w-[350px] h-[320px] rounded-[20px] overflow-hidden">
                <h2 className="text-[25px] text-[#363636] mb-4 font-bold relative z-10">{title}</h2>
                <p className="text-[15px] relative z-10 mt-30">{description}</p>
                <img
                    src={image}
                    style={{
                        width: `${imgWidth}px`,
                        position: 'absolute',
                        top: `${imgTop}px`,
                        left: `${imgLeft}px`,
                        opacity: 0.4
                    }}
                />
            </div>
        </Link>
    );
}
