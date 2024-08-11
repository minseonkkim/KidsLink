import { ImCheckboxChecked } from "react-icons/im";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

interface DocumentChildProps {
    type: string;
    name: string;
    profileImgPath: string;
    finish: string;
}

export default function DocumentChild({type, name, profileImgPath, finish}: DocumentChildProps){
    return (
        <div className="flex flex-row items-center bg-[#ffffff] p-4 w-[250px] lg:w-[290px] h-full rounded-[15px]">
            {type === "" ? (
                <Skeleton circle width={70} height={38} />
            ) : (
                <span className={`rounded-[10px] ${type === 'Dosage' ? 'bg-[#E7DFFF]' : 'bg-[#FFDFDF]'} flex items-center justify-center w-[70px] h-[38px] font-bold text-[18px]`}>
                    {type === "Absent" ? "결석" : "투약"}
                </span>
            )}
            <div className="ml-5 w-[47px] h-[47px]">
                {profileImgPath === "" ? (
                    <Skeleton circle width={47} height={47} />
                ) : (
                    <img src={profileImgPath} className="w-full h-full rounded-full object-cover" alt={`${name} profile`} />
                )}
            </div>
            <div className="flex-1 mx-3 font-bold text-[18px] lg:text-[21px] truncate">
                {name === "" ? <Skeleton width={100} /> : name}
            </div>
            {finish === "T" && <ImCheckboxChecked className="ml-[10px] w-[20px] h-[20px]"/>}
        </div>
    );
}
