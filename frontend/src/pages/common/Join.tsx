import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import useAppStore from "../../stores/store"
import JoinHeader from "../../components/join/JoinHeader"
import MemberCard from "../../components/join/MemberCard"
import parentImg from "../../assets/join/joinParentImg.png"
import teacherImg from "../../assets/join/joinTeacherImg.png"
import ownerImg from "../../assets/join/joinOwnerImg.png"

// 사용자 구분
const members = [
  { role: "parent", img: parentImg, displayName: "학부모" },
  { role: "teacher", img: teacherImg, displayName: "선생님" },
  { role: "director", img: ownerImg, displayName: "원장님" },
]

export default function Join() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setIsSocialLogin, setUsername, setEmail } = useAppStore()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  useEffect(() => {
    // location.state에서 데이터 추출
    if (location.state) {
      const { username, email } = location.state as { username: string; email: string }

      console.log("소셜에서 가져오고 있는 data: ", username, email)
      setIsSocialLogin(true)
      setUsername(username)
      setEmail(email)
    }
  }, [location.state, setIsSocialLogin, setUsername, setEmail])

  const handleCardClick = (role: string) => {
    setSelectedRole(role)
    navigate(`/join/${role}`)
  }

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
                role={item.displayName}  
                img={item.img}
                isSelected={selectedRole === item.role}
                onClick={() => handleCardClick(item.role)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
