import parentImg from '../assets/join/joinParentImg.png'
import teacherImg from '../assets/join/joinTeacherImg.png'
import ownerImg from '../assets/join/joinOwnerImg.png'
import ParentHeader from '../components/parent/common/ParentHeader'
import MemberCard from '../components/join/MemberCard'
import { useState } from 'react'

const members = [
    {role: "학부모", img: parentImg},
    {role: "선생님", img: teacherImg},
    {role: "원장님", img: ownerImg},
]

export default function Join() {
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    const handleCardClick = (role: string) => {
        setSelectedRole(role);
    };
    return (
        <>
            <div className="w-full h-full min-h-screen bg-white flex flex-col items-center py-10">
                <div
                    className="w-[455px] h-[67px] bg-white shadow-md flex items-center justify-center mb-10"
                    style={{ boxShadow: "0px 1px 0px 1px rgba(217,217,217,0.8)" }}
                >
                    <p className="text-[26px] font-bold gradient-text">키즈링크</p>
                </div>
                <p className="text-[35px] font-bold text-center text-[#363636] mb-5">
                    회원가입
                </p>
                <p className="text-[22px] font-medium text-center text-[#363636] mb-10">
                    본인의 역할을 정확하게 선택해 주세요.
                </p>
                <div >
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
        </>
    );
}