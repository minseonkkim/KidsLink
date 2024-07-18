import { FaArrowLeft } from "react-icons/fa";
import { Link } from 'react-router-dom';

interface NavigateBackProps {
    backPage: string;
    backLink: string;
}

export default function NavigateBack({backPage, backLink}: NavigateBackProps){
    return <>
        <Link to={backLink}>
            <div className="absolute top-[120px] left-[150px] h-[50px] text-[20px] font-bold flex flex-row items-center cursor-pointer">
                <FaArrowLeft style={{ color: '#8CAD1E' }} />
                <span className="text-[#8CAD1E] mx-3">{backPage}</span>
            </div>
        </Link>
    </>
}