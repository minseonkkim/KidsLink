import NavigateBack from "../../components/teacher/common/NavigateBack";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import Title from "../../components/teacher/common/Title";
import { logout } from "../../api/member";
import { useNavigate } from "react-router-dom";
import { useTeacherInfoStore } from "../../stores/useTeacherInfoStore";
import useAppStore from "../../stores/store";
import { useEffect, useState } from "react";
import DefaultProfile from "../../assets/teacher/default_profile.png";
import { getTeacherInfo } from "../../api/Info";

export default function TeacherMyPage() {
  const navigate = useNavigate();
  const setUserType = useAppStore((state) => state.setUserType);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리 추가

  useEffect(() => {
    const teacherInfo = useTeacherInfoStore.getState().teacherInfo;

    if (!teacherInfo) {
      getTeacherInfo()
        .then((data) => {
          useTeacherInfoStore.setState({ teacherInfo: data });
          setIsLoading(false); // 데이터 로드 완료 후 로딩 상태 해제
        })
        .catch((error) => {
          console.error("Failed to fetch teacher info:", error);
          setIsLoading(false); // 오류 발생 시에도 로딩 상태 해제
        });
    } else {
      setIsLoading(false); // 이미 데이터가 있는 경우 로딩 상태 해제
    }
  }, []);

  const teacherInfo = useTeacherInfoStore.getState().teacherInfo;

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

  if (isLoading) {
    return <div>Loading...</div>; // 데이터가 로드될 때까지 로딩 상태를 표시
  }
  return (
    <>
      <TeacherHeader />
      <div className="mt-[120px] px-[130px]">
        <NavigateBack backPage="홈" backLink="/" />
        <Title title="마이페이지" />
        <div className="flex justify-center">
          <div className="w-[323px] lg:w-[340px] h-auto lg:h-[500px] h-[200px] rounded-[20px] bg-[#f4f4f4] flex flex-col lg:flex-col items-center py-7 drop-shadow-md mb-5 lg:mb-0 mt-7 lg:mt-0">
            <div className="flex flex-row lg:flex-col items-center lg:items-center lg:mb-0 mb-2">
              <div className="w-[80px] h-[80px] lg:w-[170px] lg:h-[170px]">
                <img
                  src={teacherInfo.profile ? teacherInfo.profile : DefaultProfile}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="flex flex-col items-center items-start mt-0 lg:mt-3 text-left lg:text-center ml-4 lg:ml-0 lg:mb-2">
                <p className="text-[20px] lg:text-[30px] font-bold text-[#8cad1e]">
                  {teacherInfo.kindergartenClassName + " 선생님"}
                </p>
                <p className="text-[22px] lg:text-[20px] font-bold text-[#363636]">
                  {teacherInfo.name}
                </p>
              </div>
            </div>
            <div className="flex justify-center items-center mt-4">
              <button
                onClick={handleLogout}
                className="bg-[#8cad1e] text-white px-4 py-2 rounded-[20px] text-[13px] hover:bg-[#76a118] transition-colors duration-200"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
