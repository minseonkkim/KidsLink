import { useEffect } from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { FaBirthdayCake, FaVenusMars } from "react-icons/fa";
import { MdSchool, MdCake } from "react-icons/md";
import profileImg from "../../assets/parent/daramgi.png";
import { logout } from "../../api/member";
import { useNavigate } from "react-router-dom";
import useAppStore from "../../stores/store";
import { useParentInfoStore } from "../../stores/useParentInfoStore";
import { getParentInfo } from "../../api/Info";

export default function ParentMyPage() {
  const { parentInfo, setParentInfo } = useParentInfoStore();

  useEffect(() => {
    const fetchParentInfo = async () => {
      if (!parentInfo) {
        try {
          const fetchedParentInfo = await getParentInfo();
          setParentInfo(fetchedParentInfo);
        } catch (error) {
          console.error("Error fetching parent info:", error);
        }
      }
    };
    fetchParentInfo();
  }, [parentInfo, setParentInfo]);

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

  // 나이 계산 함수 (만 나이)
  const calculateAge = (birthDateString: string): number => {
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const isBeforeBirthday =
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate());

    if (isBeforeBirthday) {
      age--;
    }

    return age;
  };

  const childAge = parentInfo ? calculateAge(parentInfo.child.birth) : null;

  // 성별에 따른 색상 설정
  const genderColor =
    parentInfo?.child.gender === "M" ? "text-blue-400" : "text-pink-400";
  const borderColor =
    parentInfo?.child.gender === "M" ? "border-blue-400" : "border-pink-400";
  const nameColor =
    parentInfo?.child.gender === "M" ? "text-blue-600" : "text-pink-600";

  return (
    <div className="relative min-h-[100dvh] flex flex-col bg-[#FFEC8A] overflow-hidden">
      <div className="absolute bottom-0 h-[80%] flex flex-col w-full bg-white shadow-top rounded-tl-[25px] rounded-tr-[25px] py-6 px-8 animate-slideUp">
        <div
          className="text-[18px] flex flex-row justify-end items-center py-2 px-3 cursor-pointer text-gray-600"
          onClick={handleLogout}
        >
          <IoLogOutOutline className="mr-2 text-xl" /> 로그아웃
        </div>

        <div className="h-[1px] bg-[#FFDAB9] my-4" />

        {/* 아이 정보 */}
        <div className="flex flex-col items-start my-6 px-4">
          <img
            src={parentInfo?.child.profile || profileImg}
            className={`w-[130px] h-[130px] rounded-full object-cover mb-4 border-4 ${borderColor}`}
            alt="아이 프로필"
          />
          <div className={`font-bold text-[22px] mb-2 ${nameColor}`}>
            {parentInfo ? parentInfo.child.name : ""}
          </div>
          <div className="text-[16px] text-gray-700 mt-1 flex items-center">
            <FaVenusMars className={`inline mr-2 ${genderColor}`} />
            성별: {parentInfo ? (parentInfo.child.gender === "M" ? "남자" : "여자") : ""}
          </div>
          <div className="text-[16px] text-gray-700 mt-1 flex items-center">
            <FaBirthdayCake className={`inline mr-2 ${genderColor}`} />
            생년월일: {parentInfo?.child.birth}
          </div>
          <div className="text-[16px] text-gray-700 mt-1 flex items-center">
            <MdCake className={`inline mr-2 ${genderColor}`} />
            나이: {childAge ? `만 ${childAge}세` : ""}
          </div>
        </div>

        <div className="h-[1px] bg-[#FFDAB9] my-4" />

        {/* 유치원 및 반 정보 */}
        <div className="flex flex-col items-start px-4 mb-8">
          <div className="text-[16px] text-gray-700 flex items-center mb-2">
            <MdSchool className="inline mr-2 text-yellow-500" />
            유치원: {parentInfo ? parentInfo.child.kindergartenClass.kindergarten.kindergartenName : ""}
          </div>
          <div className="text-[16px] text-gray-700 flex items-center">
            <MdSchool className="inline mr-2 text-yellow-500" />
            반: {parentInfo ? parentInfo.child.kindergartenClass.kindergartenClassName : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
