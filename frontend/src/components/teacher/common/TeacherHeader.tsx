import { CgProfile } from "react-icons/cg";
import { FaBell } from "react-icons/fa";

export default function TeacherHeader(){
    return <>
        <div className="flex items-center justify-between h-[85px] bg-[#ffffff] relative shadow-md z-10">
            <p className="ml-[150px] text-[40px] font-bold text-left font-Cafe24Ssurround gradient-text cursor-pointer">아이샘톡</p>
            <div className="flex flex-row">
                <CgProfile className="w-[30px] h-[30px] mr-8 cursor-pointer" style={{ color: '#363636' }} />
                <div className="relative mr-[160px]">
                    <FaBell className="w-[30px] h-[30px] cursor-pointer" style={{ color: '#363636' }} />
                    <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[12px] font-bold rounded-full flex items-center justify-center">2</span>
                </div>
            </div>
        </div>
    </>
}