import parentImg from "../../assets/join/joinParentImg.png";
import teacherImg from "../../assets/join/joinTeacherImg.png";
import ownerImg from "../../assets/join/joinOwnerImg.png";
import MemberCard from "../../components/join/MemberCard";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import JoinHeader from "../../components/join/JoinHeader";

const members = [
  { role: "parent", img: parentImg, displayName: "학부모" },
  { role: "teacher", img: teacherImg, displayName: "선생님" },
  { role: "director", img: ownerImg, displayName: "원장님" },
];

export default function Join() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCardClick = (role: string) => {
    setSelectedRole(role);
    // 여기서 role을 URL 파라미터로 전달하는 방식으로 수정합니다.
    navigate(`/join/${role}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <JoinHeader />
      <div className="w-full flex flex-col items-center my-16 flex-grow">
        <p className="w-[412px] text-[35px] font-bold text-center text-[#363636] my-10">
          회원가입
        </p>
        <p className="text-[20px] font-medium text-center text-[#363636] mb-4">
          본인의 역할을 정확하게 선택해 주세요.
        </p>
        <div className="flex flex-col items-center text-[35px] font-bold text-center text-[#363636] mb-5 mt-10">
          {members.map((item, index) => (
            <div key={index} className="w-[300px] mb-8">
              <MemberCard
                role={item.displayName}  // 역할 이름을 displayName으로 설정
                img={item.img}
                isSelected={selectedRole === item.role}
                onClick={() => handleCardClick(item.role)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
