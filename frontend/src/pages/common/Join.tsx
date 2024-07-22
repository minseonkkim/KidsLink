import parentImg from "../../assets/join/joinParentImg.png";
import teacherImg from "../../assets/join/joinTeacherImg.png";
import ownerImg from "../../assets/join/joinOwnerImg.png";
import MemberCard from "../../components/join/MemberCard";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import JoinHeader from "../../components/join/JoinHeader";

const members = [
  { role: "학부모", img: parentImg },
  { role: "선생님", img: teacherImg },
  { role: "원장님", img: ownerImg },
];

export default function Join() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCardClick = (role: string) => {
    setSelectedRole(role);
    navigate(`/join/details/${role}`);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center">
        <JoinHeader />
        <div className="w-full flex flex-col items-center my-16 flex-grow">
            <p className="w-[412px] text-[35px] font-bold text-center text-[#363636] mb-5 mt-14">
            회원가입
            </p>
            <p className="text-[20px] font-medium text-center text-[#363636] mb-10">
            본인의 역할을 정확하게 선택해 주세요.
            </p>
            <div className="flex flex-col items-center text-[35px] font-bold text-center text-[#363636] mb-5 mt-10">
            {members.map((item, index) => (
                <div key={index} className="w-[300px] mb-10">
                <MemberCard
                    role={item.role}
                    img={item.img}
                    isSelected={selectedRole === item.role}
                    onClick={() => handleCardClick(item.role)}
                />
                </div>
            ))}
            </div>
        </div>
      </div>
    </>
  );
}
