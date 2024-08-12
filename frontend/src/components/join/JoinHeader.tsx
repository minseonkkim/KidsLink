import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

export default function JoinHeader() {
  const navigate = useNavigate()

  const handleHomeClick = () => {
    navigate("/")
  }

  return (
    <div className="fixed top-0 left-0 right-0 flex items-center justify-between h-[85px] bg-[#fff] shadow-md z-50">
            <Link to="/"><p className="ml-[150px] text-[40px] font-bold text-left font-Cafe24Ssurround gradient-text cursor-pointer">키즈링크</p></Link>
            <div className="mr-[150px] text-[18px]">
                <Link to="/login"><button className="mr-5">로그인</button></Link>
                <Link to="/join"><button>회원가입</button></Link>
            </div>
        </div>
  )
}
