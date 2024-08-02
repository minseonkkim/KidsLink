import NavigateBack from "../../components/teacher/common/NavigateBack";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import Title from "../../components/teacher/common/Title";
import { logout } from "../../api/member";
import { useNavigate } from "react-router-dom";
import useAppStore from "../../stores/store";
import TestButton from "../../components/TestButton";


export default function TeacherMyPage(){
    const navigate = useNavigate();
    const setUserType = useAppStore((state) => state.setUserType);

    const handleLogout = async () => {
        try {
          await logout();
        } catch (error) {
          console.error("Logout failed", error);
        } finally {
          setUserType("");
          navigate("/");
        }
      };

    return <>
        <TeacherHeader/>
        <div className="mt-[120px] px-[130px]">
            <NavigateBack backPage="홈" backLink='/' />
            <Title title="마이페이지" />
            <div className="flex justify-center items-center">
                <button onClick={handleLogout} className="bg-[#f4f4f4] px-2 py-1 rounded-[20px] text-[13px]">로그아웃</button>
                <TestButton />
            </div>
        </div>
    </>
}