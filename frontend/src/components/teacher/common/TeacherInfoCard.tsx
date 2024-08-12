import DefaultProfile from "../../../assets/teacher/default_profile.png";
import { useTeacherInfoStore } from "../../../stores/useTeacherInfoStore";

export const TeacherInfoCard: React.FC = () => {
  const teacherInfo = useTeacherInfoStore((state) => state.teacherInfo);

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
        <p className="text-sm font-bold text-[#363636]">
          {teacherInfo?.name}
        </p>
      </div>
    </div>
  );
};
