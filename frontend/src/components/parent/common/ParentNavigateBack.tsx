import { Link } from 'react-router-dom';
import { IoChevronBack } from "react-icons/io5";

interface NavigateBackProps {
    backPage: string;
    backLink: string;
}

export default function ParentNavigateBack({ backPage, backLink }: NavigateBackProps) {
    return (        
        <>
            <div className="absolute top-0 left-0 w-[455px] h-[50px] text-[20px] font-bold flex items-center bg-white z-10">
                <Link to={backLink} className="flex items-center">
                    <IoChevronBack style={{ color: '#8CAD1E' }} />
                    <span className="text-[#8CAD1E] mx-3">{backPage}</span>
                </Link>
            </div>
        </>
    );
}
