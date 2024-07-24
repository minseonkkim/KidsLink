import { FC } from "react";
import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import daramgi from "../../assets/join/joinResultDaramgi.png";
import { useAppStore } from "../../stores/store"

interface ParentFormStep3Props {
  onComplete: () => void;
}

const ParentFormStep3: FC<ParentFormStep3Props> = () => {
  const navigate = useNavigate();
  const { login } = useAppStore();

  const handleLogin = () => {
    login();
    navigate('/');
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      {/* 회원가입 진행률 */}
      <div className="relative flex h-[62px] mx-3">
        <div className="flex-1 relative">
          <div className="border-t-[3px] border-[#F8DE56] absolute left-[25px] right-0 transform -translate-y-1/2"></div>
          <div className="absolute left-[25px] top-[-12px] flex items-center justify-center w-6 h-6 bg-[#F8DE56] rounded-full">
            <FaCheck className="w-3 h-3 text-white" />
          </div>
          <p className="mt-6 text-sm font-normal text-left text-[#B8B8B8]">부모정보입력</p>
        </div>
        <div className="flex-1 relative">
          <div className="border-t-[3px] border-[#F8DE56] absolute left-0 right-0 transform -translate-y-1/2"></div>
          <div className="absolute left-1/2 transform -translate-x-[48%] top-[-12px] flex items-center justify-center w-6 h-6 bg-[#F8DE56] rounded-full">
            <FaCheck className="w-3 h-3 text-white" />
          </div>
          <p className="mt-6 text-sm font-light text-center text-[#B8B8B8]">자녀정보입력</p>
        </div>
        <div className="flex-1 relative">
          <div className="border-t-[3px] border-[#F8DE56] absolute left-0 right-[15px] transform -translate-y-1/2"></div>
          <div className="absolute right-[14px] top-[-12px] flex items-center justify-center w-6 h-6 bg-[#F8DE56] rounded-full">
            <div className="flex items-center justify-center w-4 h-4 bg-white rounded-full">
              <div className="w-2 h-2 bg-[#F8DE56] rounded-full"></div>
            </div>
          </div>
          <p className="mt-6 text-sm font-light text-right text-black">가입완료</p>
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
