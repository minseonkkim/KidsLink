import { useLocation } from "react-router-dom"
import JoinHeader from "../../components/join/JoinHeader"
import ParentForm from "../../components/join/ParentForm3"
import TeacherForm from "../../components/join/TeacherForm"

export default function JoinDetails() {
  const location = useLocation();
  const { role } = location.state || {}

  if (!role) {
    return <p>역할 정보가 없습니다.</p>
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <JoinHeader />
      
      <div className="w-full max-w-xl mx-auto mt-24 p-4">
        <p className="text-2xl font-bold mx-6">회원가입</p>
        <div className="border-b-2 border-black my-3 mx-6"></div>

        {role === "학부모" && <ParentForm />}
        {role === "선생님" && <TeacherForm />}
      </div>
    </div>
  )
}
