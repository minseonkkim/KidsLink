import DefaultProfile from "../../../assets/teacher/default_profile.png";
import { useTeacherInfoStore } from "../../../stores/useTeacherInfoStore";
// import { LuSchool2 } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { getTeacherInfo } from "../../../api/Info";
import { useEffect } from "react";

export const TeacherInfoCard: React.FC = () => {
  const navigate = useNavigate();
  const teacherInfo = useTeacherInfoStore((state) => state.teacherInfo);
  const setTeacherInfo = useTeacherInfoStore((state) => state.setTeacherInfo);

  useEffect(() => {
    async function fetchTeacherInfo() {
      try {
        if (!teacherInfo) {
          const fetchedTeacherInfo = await getTeacherInfo();
          setTeacherInfo(fetchedTeacherInfo);
        }
      } catch (error) {
        console.error("Failed to fetch teacher info:", error);
      }
    }

    fetchTeacherInfo();
  }, [teacherInfo, setTeacherInfo]);

  // const handleHomeClick = () => {
  //   navigate('/');
  // };

  return (
    <div className="flex items-center space-x-4 p-4 bg-[#f4f4f4] rounded-lg shadow-md">
      <div className="w-[50px] h-[50px]">
        <img
          src={teacherInfo?.profile ? teacherInfo.profile : DefaultProfile}
          alt="Profile"
          className="w-full h-full rounded-full object-cover"
        />
      </div>
      <div>
        <p className="text-sm font-bold text-[#8cad1e]">
          {teacherInfo?.kindergartenClassName} 선생님
        </p>
        {/* <div className="flex"> */}
        <p className="text-sm font-bold text-[#363636] mr-1">
          {teacherInfo?.name}
        </p>
        {/* <LuSchool2 className="w-[14px] cursor-pointer" onClick={handleHomeClick} /> */}
        {/* </div> */}
      </div>
    </div>
  );
};
