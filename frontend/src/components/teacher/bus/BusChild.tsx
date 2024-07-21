import profileImg from "../../../assets/teacher/profile_img.jpg";
import { IoCallOutline } from "react-icons/io5";

export default function BusChild(){
    return <>
    <div className="flex flex-row items-center p-5">
        <div className="w-[80px] h-[80px] mr-5">
            <img src={profileImg} className="w-full h-full rounded-full object-cover"  />
        </div>
        <div className="flex flex-col items-start w-[200px]">
            <p className="font-bold text-[20px]">김민선</p>
            <div className="flex flex-row items-center">
                <IoCallOutline className="mr-2 text-[#7C7C7C]"/>
                <p className="text-[#7C7C7C]">000-0000-0000</p>
            </div>
        </div>
        <input type="checkbox" className="w-5 h-5 accent-[#363636]"/>
    </div>
    </>
}