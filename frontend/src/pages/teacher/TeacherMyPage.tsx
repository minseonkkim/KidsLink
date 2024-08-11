import React, { useEffect, useState } from "react";
import Title from "../../components/teacher/common/Title";
import { logout } from "../../api/member";
import { useNavigate } from "react-router-dom";
import { useTeacherInfoStore } from "../../stores/useTeacherInfoStore";
import useAppStore from "../../stores/store";
import DefaultProfile from "../../assets/teacher/default_profile.png";
import { getTeacherInfo } from "../../api/Info";
import TeacherLayout from '../../layouts/TeacherLayout';
import daramgi from "../../assets/teacher/playing-daramgi.png"

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
    return (
      <TeacherLayout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-500 text-lg">Loading...</p>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout
        activeMenu="meeting"
        setActiveMenu={() => {}}
        titleComponent={<Title title="마이페이지" />}
        imageSrc={daramgi} 
    >
      <div className="px-4 lg:px-8 py-6 lg:py-8 mt-24">
        
        <div className="flex justify-center mt-8">
          <div className="w-full max-w-md bg-[#f4f4f4] rounded-lg shadow-md overflow-hidden flex flex-col items-center py-6">
            <div className="flex flex-col items-center mb-4">
              <div className="w-[120px] h-[120px] lg:w-[150px] lg:h-[150px] mb-4">
                <img
                  src={teacherInfo.profile ? teacherInfo.profile : DefaultProfile}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="text-center">
                <p className="text-xl lg:text-2xl font-bold text-[#8cad1e]">
                  {teacherInfo.kindergartenClassName} 선생님
                </p>
                <p className="text-lg lg:text-xl font-bold text-[#363636]">
                  {teacherInfo.name}
                </p>
              </div>
            </div>
            <div className="flex justify-center w-full">
              <button
                onClick={handleLogout}
                className="bg-[#8cad1e] text-white px-6 py-2 rounded-full text-sm lg:text-base hover:bg-[#76a118] transition-colors duration-200"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
