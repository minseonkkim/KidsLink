import { useLocation } from "react-router-dom";
import ParentForm from "../../components/join/ParentForm"
import TeacherForm from "../../components/join/TeacherForm"

export default function JoinDetails() {
  const location = useLocation();
  const { role } = location.state || {}

  if (!role) {
    return <p>역할 정보가 없습니다.</p>
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <h1 className="text-[35px] font-bold text-center text-[#363636] mb-5 mt-14">
        {role === "학부모" ? "학부모 회원가입" : "선생님 회원가입"}
      </h1>
      {role === "학부모" && <ParentForm />}
      {role === "선생님" && <TeacherForm />}
    </div>
  )
}
