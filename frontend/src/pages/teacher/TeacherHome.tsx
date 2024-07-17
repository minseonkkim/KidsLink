import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import profileImg from '../../assets/profile_img.jpg';
import MenuButton from "../../components/teacher/main/MenuButton";
import growthdiaryBtnImg from "../../assets/growthdiary_btn_img.png";


export default function TeacherHome(){
    return <>
        <TeacherHeader/>
        <div className="font-KoPubDotum flex flex-row min-h-[calc(100vh-105px)] h-full items-center justify-between px-[150px]">
            
            <div className="w-[360px] h-[550px] rounded-[20px] bg-[#f8f8f8] flex flex-col items-center py-10">
                <div className="w-[180px] h-[180px]">
                    <img src={profileImg} className="w-full h-full rounded-full object-cover"  />
                </div>
                <p className="text-[30px] font-bold text-center text-[#8cad1e] mt-3">개나리반 선생님</p>
                <p className="text-[22px] font-bold text-center text-[#363636] mb-3">정 현 수</p>
                <div className="w-[290px] h-full rounded-[10px] bg-white flex flex-col items-center justify-between">
                    <div className="w-[290px] h-[30px] rounded-tl-[10px] rounded-tr-[10px] bg-[#d7d7d7] flex items-center justify-center font-bold text-[#ffffff] text-[18px]">2024 / 07 / 17</div>
                    <div className="w-[250px] mx-3 mt-2 text-center text-[16px] whitespace-nowrap truncate">
                        <div>예정된 상담 3건</div>
                        <div>등원 및 인사</div>
                        <div>...</div>
                    </div>
                    <div className="flex flex-row">
                        <button className="w-[120px] h-[38px] items-center justify-center rounded-[10px] text-center text-[#b8b8b8] font-bold text-[17px] border-2 border-[#b8b8b8] mx-2 my-3">모든 일정 보기</button>
                        <button className="w-[120px] h-[38px] items-center justify-center rounded-[10px] text-center text-[#b8b8b8] font-bold text-[17px] border-2 border-[#b8b8b8] mx-2 my-3">우리반 보기</button>
                    </div>
                </div>
            </div>
            <div><MenuButton name="성장일지" imgpath={growthdiaryBtnImg}/></div>
        </div>
    </>
}