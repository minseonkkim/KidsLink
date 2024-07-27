import NavigateBack from "../../components/teacher/common/NavigateBack";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import Title from "../../components/teacher/common/Title";

export default function TeacherMyPage(){
    return <>
        <TeacherHeader/>
        <div className="mt-[120px] px-[130px]">
            <NavigateBack backPage="홈" backLink='/' />
            <Title title="마이페이지" />
            <div className="flex justify-center items-center">
                <button className="bg-[#f4f4f4] px-2 py-1 rounded-[20px] text-[13px]">로그아웃</button>
            </div>
        </div>
    </>
}