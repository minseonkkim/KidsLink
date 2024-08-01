import { useEffect, useState } from "react"
import { login} from "../../../api/member"
import { useNavigate } from "react-router-dom"
import ProgressBar from "../ProgressBar"
import daramgi from "../../../assets/join/joinResultDaramgi.png"
import useAppStore from "../../../stores/store"
import Firework from "../Firework"

export default function TeacherFormStep3() {
  const { username, password, name } = useAppStore()
  const navigate = useNavigate()
  const [showConfetti, setShowConfetti] = useState(true)

  // 폭죽 효과
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleLogin = async () => {
    try {
      await login({ username, password })
      navigate("/")
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  return (
    <div className="w-full p-6 mx-auto">
      {showConfetti && <Firework />}

      {/* 회원가입 진행률 */}
      <ProgressBar
        steps={["선생님정보입력", "유치원정보입력", "가입완료"]}
        currentStep={2}
      />

      {/* 3단계 */}
      <div className="text-center mt-10">
        <div className="relative w-[130px] h-[130px] mx-auto mb-14">
          <img src={daramgi} alt="Daramgi" />
        </div>
        <p className="text-base font-bold text-black">회원가입 완료</p>
        <p className="text-[11px] font-light text-black mt-3">
          <span>{ name } 님의</span>
          <br />
          <span>회원가입이 완료되었습니다.</span>
        </p>

        <button
          onClick={handleLogin}
          className="mt-8 w-[93px] h-10 bg-[#F8DE56] rounded-[5px] text-sm font-bold text-center text-[#363636]"
        >
          로그인
        </button>
      </div>
    </div>
  )
}
