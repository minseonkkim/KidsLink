import profileImg from "../../../assets/teacher/profile_img.jpg";
import { IoCallOutline } from "react-icons/io5";
import { useState } from "react"; 

interface BusChildProps {
    childName: string;
    parentTel: string;
    status: string;
}

export default function BusChild({childName, parentTel, status}: BusChildProps){
    const [isChecked, setCheck] = useState(status);

    const check = () => {
        if(isChecked === "T") setCheck("F");
        else if(isChecked === "F") setCheck("T");
    }
    
    return <>
    <div className="flex flex-row items-center p-[14px]">
        <div className="w-[80px] h-[80px] mr-5">
            <img src={profileImg} className="w-full h-full rounded-full object-cover"  />
        </div>
        <div className="flex flex-col items-start w-[178px]">
            <p className="font-bold text-[20px]">{childName}</p>
            <div className="flex flex-row items-center">
                <IoCallOutline className="mr-2 text-[#7C7C7C]"/>
                <p className="text-[#7C7C7C] text-[14px]">{parentTel}</p>
            </div>
        </div>
        <input type="checkbox" className="w-5 h-5 accent-[#363636]" checked={isChecked === 'T'} onClick={check}/>
    </div>
    </>
}