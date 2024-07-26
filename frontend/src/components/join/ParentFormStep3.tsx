import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import Confetti from "react-confetti";
import daramgi from "../../assets/join/joinResultDaramgi.png";
import { useAppStore } from "../../stores/store";
import { login as apiLogin } from "../../api/member";
import { useNavigate } from "react-router-dom";

const ParentFormStep3 = () => {
  const { username, password } = useAppStore();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000); // 폭죽 효과가 5초 동안 나타나도록 설정
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async () => {
    try {
      await apiLogin({ username, password });
      console.log("로그인 체크");
      console.log(useAppStore.getState().userType);
      navigate("/"); // 로그인 성공 후 리다이렉션
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="w-full p-6">
      {showConfetti && (
        <Confetti
          numberOfPieces={500}
          gravity={0.5}
          initialVelocityX={10}
          initialVelocityY={20}
          wind={0}
          recycle={false}
        />
      )}
      {/* 회원가입 진행률 */}
      <div className="relative flex h-[62px] mx-3">
        <div className="flex-1 relative">
          <div className="border-t-[3px] border-[#F8DE56] absolute left-[25px] right-0 transform -translate-y-1/2"></div>
          <div className="absolute left-[25px] top-[-12px] flex items-center justify-center w-6 h-6 bg-[#F8DE56] rounded-full">
            <FaCheck className="w-3 h-3 text-white" />
          </div>
          <p className="mt-6 text-sm font-normal text-left text-[#B8B8B8]">
            부모정보입력
          </p>
        </div>
        <div className="flex-1 relative">
          <div className="border-t-[3px] border-[#F8DE56] absolute left-0 right-0 transform -translate-y-1/2"></div>
          <div className="absolute left-1/2 transform -translate-x-[48%] top-[-12px] flex items-center justify-center w-6 h-6 bg-[#F8DE56] rounded-full">
            <FaCheck className="w-3 h-3 text-white" />
          </div>
          <p className="mt-6 text-sm font-light text-center text-[#B8B8B8]">
            자녀정보입력
          </p>
        </div>
        <div className="flex-1 relative">
          <div className="border-t-[3px] border-[#F8DE56] absolute left-0 right-[15px] transform -translate-y-1/2"></div>
          <div className="absolute right-[14px] top-[-12px] flex items-center justify-center w-6 h-6 bg-[#F8DE56] rounded-full">
            <div className="flex items-center justify-center w-4 h-4 bg-white rounded-full">
              <div className="w-2 h-2 bg-[#F8DE56] rounded-full"></div>
            </div>
          </div>
          <p className="mt-6 text-sm font-light text-right text-black">
            가입완료
          </p>
        </div>
      </div>

      {/* 3단계 */}
      <div className="text-center mt-10">
        <div className="relative w-[130px] h-[130px] mx-auto mb-14">
          <img src={daramgi} alt="Daramgi" />
        </div>
        <p className="text-base font-bold text-black">회원가입 완료</p>
        <p className="text-[11px] font-light text-black mt-3">
          <span>정현수 님의</span>
          <br />
          <span>회원가입이 완료되었습니다.</span>
        </p>
        <div className="mt-8">
          <button
            onClick={handleLogin}
            className="w-[93px] h-10 bg-[#F8DE56] rounded-[5px] text-sm font-bold text-center text-[#363636]"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentFormStep3;
