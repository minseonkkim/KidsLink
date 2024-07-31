import { useState } from "react";
import ParentHeader from "../../components/parent/common/HomeHeader";
import { IoLogOutOutline } from "react-icons/io5";
import profileImg from "../../assets/parent/daramgi.png"; 
import { logout } from "../../api/member";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../stores/store";
import { useParentInfoStore } from "../../stores/useParentInfoStore";

export default function ParentMyPage() {
  const { parentInfo } = useParentInfoStore();
  const [currentProfileImg] = useState(parentInfo?.profile || ""); 
  const [currentChildImg] = useState(parentInfo?.child.profile || "");

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

  return (
    <div className="min-h-[100dvh] flex flex-col items-center bg-[#FFEC8A]">
      <ParentHeader />
      <div className="w-full h-[807px] absolute left-0 top-[93px]">
        <div className="w-full h-full absolute left-0 top-0 rounded-tl-[20px] rounded-tr-[20px] bg-white shadow-top px-5">
          <div
            className="mt-3 text-[17px] flex flex-row justify-end items-center py-3 px-1"
            onClick={handleLogout}
          >
            <IoLogOutOutline className="mr-1" /> 로그아웃
          </div>
          <div className="h-[1px] bg-[#B8B8B8]" />
          <div className="flex flex-col items-center mt-5 mb-1">
            <div className="relative mb-3">
              <img
                src={currentProfileImg || profileImg} 
                className="w-[160px] h-[160px] rounded-full object-cover"
              />
            </div>
          </div>
          <div className="font-bold text-[20px] text-center mb-1">
            밤밤수 학부모
          </div>
          <div className="flex justify-center">
            <button className="drop-shadow-md border rounded-[20px] px-2 py-1 bg-[#f4f4f4]">
              내 정보
            </button>
          </div>
          <div className="h-[1px] bg-[#B8B8B8] mt-5" />
          <div className="text-[17px] my-2">아이 정보</div>
          <div className="rounded-[10px] bg-[#FFF9D7] w-full p-5 flex flex-row">
            <img
              src={currentChildImg || profileImg} 
              className="w-[100px] h-[100px] rounded-full object-cover"
            />
 
            <div className="flex flex-col justify-center items-center flex-grow">
              <div className="mb-1">싸피유치원 햇님반</div>
              <div className="font-bold text-[18px]">밤밤수</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
