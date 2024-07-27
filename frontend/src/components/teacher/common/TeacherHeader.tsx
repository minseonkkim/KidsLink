import { CgProfile } from "react-icons/cg";
import { BiBell } from "react-icons/bi";
import { Link } from "react-router-dom";

export default function TeacherHeader(){
    return <>
        <header className="z-10 fixed top-0 w-full flex items-center justify-between h-[85px] bg-[#ffffff] shadow-md">
            <Link to='/'><p className="max-sm:ml-[30px] ml-[150px] text-[40px] font-bold text-left font-Cafe24Ssurround gradient-text cursor-pointer">키즈링크</p></Link>
            <div className="flex flex-row">
                <Link to='/mypage'><CgProfile className="w-[30px] h-[30px] mr-8 cursor-pointer" style={{ color: '#363636' }} /></Link>
                <div className="relative max-sm:mr-[30px] mr-[150px]">
                    <BiBell className="w-[30px] h-[30px] cursor-pointer" style={{ color: '#363636' }} />
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">2</span>
                </div>
            </div>
        </header>
    </>
}