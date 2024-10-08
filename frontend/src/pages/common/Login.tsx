import React, { useState, useEffect } from "react";
import LoginHeader from "../../components/login/LoginHeader";
import mainImg from "../../assets/teacher/main_img.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login as loginAPI } from "../../api/member";
import useAppStore from "../../stores/store";
import { useMediaQuery } from 'react-responsive';
import Typewriter from 'typewriter-effect';
import { FcGoogle } from "react-icons/fc";
import { RiKakaoTalkFill } from "react-icons/ri";
import { FaChevronDown, FaRegEyeSlash, FaRegEye, FaChevronUp } from "react-icons/fa";
import LandingPage from "./LandingPage";
import { keyframes } from '@emotion/react'; 


export default function Login() {
  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 740px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 740px)" });

  return (
    <>
      {isDesktopOrLaptop && <DesktopComponent />}
      {isTabletOrMobile && <TabletOrMobileComponent />}
    </>
  );
}



// 웹 화면으로 볼 경우
const DesktopComponent = () => {
  const location = useLocation();
  const setUserType = useAppStore((state) => state.setUserType);

  useEffect(() => {
    const state = location.state;
    if (state) {
      const { accessToken, expiredAt, role } = state;
      if (accessToken && expiredAt) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('expiredAt', expiredAt);
        setUserType(role);
      }
    }
  }, [location.state]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const setIsSocialLogin = useAppStore((state) => state.setIsSocialLogin);
  const [hide, setHide] = useState(true);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginAPI({ username, password });
      setUserType(data.role);
      navigate("/"); // 로그인 성공 후 이동할 경로
    } catch (error) {
      console.error("Error during login:", error);
      setError("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleSocialLogin = (provider: string) => {
    window.location.href = `${import.meta.env.VITE_API}/oauth2/authorization/${provider}`;
  };

  const handleJoinLinkClick = () => {
    setIsSocialLogin(false);
    navigate("/join");
  };

  const scrollToLandingPage = () => {
    const element = document.querySelector('.landing-page');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
    <style>
          {`
            @keyframes downwardBounce {
              0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
              }
              40% {
                transform: translateY(-15px);
              }
              60% {
                transform: translateY(-10px);
              }
            }

            .downward-bounce {
              animation: downwardBounce 2s infinite;
            }
          `}
        </style>
      <LoginHeader />
      <div className="flex flex-col bg-[#fff9d7] min-h-[calc(100vh-85px)] mt-[85px] h-full z-1">
        <div className="flex flex-col">
          <div className="flex flex-row h-[calc(100vh-125px)]">
          <div className="mx-[150px] py-[97px]">
            <div className="text-[38px] font-bold text-left text-[#363636] mb-[63px] h-[120px]">
              <Typewriter
                options={{
                  strings: [
                    "소중한 추억을 기록하며<br>교육의 모든 순간을 함께하세요.",
                  ],
                  autoStart: true,
                  loop: true,
                }}
              />
            </div>

            <form className="flex flex-col" onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="아이디"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-[430px] h-[60px] rounded-[18px] p-5 bg-[#f7f7f7] border border-[#7c7c7c] mb-3 text-[21px] font-medium text-left text-[#7c7c7c]"
                autoComplete="username"
              />
              <div className="relative w-[430px]">
                <input
                  type={hide ? 'password' : 'text'}
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-[430px] h-[60px] rounded-[18px] p-5 bg-[#f7f7f7] border border-[#7c7c7c] mb-4 text-[21px] font-medium text-left text-[#7c7c7c]"
                  autoComplete="current-password"
                />
                {
                  hide ?
                    <div className="cursor-pointer absolute top-[21px] right-5 text-[21px] text-[#7c7c7c]" onClick={() => setHide(false)}><FaRegEyeSlash /></div>
                    : <div className="cursor-pointer absolute top-[21px] right-5 text-[21px] text-[#7c7c7c]" onClick={() => setHide(true)}><FaRegEye /></div>
                }
              </div>

              <button
                type="submit"
                className="w-[430px] h-[56px] rounded-[18px] bg-[#FFE96F] hover:bg-[#FFD700] text-[23px] text-[#363636] font-bold mb-5"
              >
                로그인
              </button>
            </form>
            {error && (
              <p className="text-[16px] font-medium text-left text-red-500 mb-2">
                {error}
              </p>
            )}

            <div className="mt-1 flex flex-row">
              <button
                type="button"
                className="mr-[6px] border-[1px] border-[#A1A1A1] w-[213px] h-[38px] rounded-[7px] text-[15px] font-bold mb-3 bg-[#fff] flex flex-row items-center justify-center transform hover:scale-105 transition-transform duration-200"
                onClick={() => handleSocialLogin("google")}
              >
                <FcGoogle className="mr-3 text-[20px]" />
                구글로 로그인
              </button>
              <button
                type="button"
                className="border-[1px] border-[#A1A1A1] w-[213px] h-[38px] rounded-[7px] text-[15px] font-bold mb-3 bg-[#fff] flex flex-row items-center justify-center transform hover:scale-105 transition-transform duration-200"
                onClick={() => handleSocialLogin("kakao")}
              >
                <RiKakaoTalkFill className="mr-3 text-[20px]" />
                카카오로 로그인
              </button>
            </div>

            <Link to="/join" onClick={handleJoinLinkClick}>
              <p className="text-[19px] font-medium text-left text-[#363636] flex flex-row items-center">
                키즈링크가 처음이라면?
              </p>
            </Link>

          </div>

          <img
            src={mainImg}
            className="w-[620px] absolute left-[675px] top-[180px] object-cover"
          />
          </div>

          <div className="flex justify-center h-[50px]">
              <FaChevronDown
                onClick={scrollToLandingPage}
                className="text-[24px] text-[#b1b1b1] cursor-pointer hover:text-gray-800 transition-colors duration-200 downward-bounce"
              />
            </div>
        </div>
      </div>
      <LandingPage />
    </>
  );
};

// 모바일 화면으로 볼 경우
const TabletOrMobileComponent = () => {
  const location = useLocation();
  
  useEffect(() => {
    const state = location.state;
    if (state) {
      const { accessToken, expiredAt, role } = state;
      if (accessToken && expiredAt) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('expiredAt', expiredAt);
        setUserType(role);
      }
    }
  }, [location.state]);

  const [isContentVisible, setIsContentVisible] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const setUserType = useAppStore((state) => state.setUserType);
  const setIsSocialLogin = useAppStore((state) => state.setIsSocialLogin);
  const [hide, setHide] = useState(true);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginAPI({ username, password });
      setUserType(data.role);
      navigate("/"); // 로그인 성공 후 이동할 경로
    } catch (error) {
      console.error("Error during login:", error);
      setError("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleSocialLogin = (provider: string) => {
    window.location.href = `${import.meta.env.VITE_API}/oauth2/authorization/${provider}`;
  };

  const handleJoinLinkClick = () => {
    setIsSocialLogin(false);
    navigate("/join");
  };

  const scrollToLandingPage = () => {
    const element = document.querySelector('.landing-page');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContentVisible(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {!isContentVisible && <LoginHeader />}  {/* Render LoginHeader only when isContentVisible is false */}
      
      <div className="bg-[#FFF9D7] w-[100vw] h-[100vh] flex flex-col items-center justify-center">
        {isContentVisible ? (
          <div className="transition-transform transform grow-animation">
            <p className="text-[27px] font-bold text-center text-[#363636] mb-[65px] h-[80px]">
              <span>소중한 추억을 기록하며</span>
              <br />
              <span>교육의 모든 순간을 함께하세요.</span>
            </p>
            <img src={mainImg} className="w-[330px] object-cover" />
          </div>
        ) : (
          <div>
            <form className="flex flex-col" onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="로그인"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-[330px] h-[58px] rounded-[20px] p-5 bg-white border border-[#b9b9b9] mb-3 text-[22px] font-medium text-left text-[#b9b9b9]"
                autoComplete="username"
              />
              <div className="relative w-[330px]">
                <input
                  type={hide ? 'password' : 'text'}
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-[330px] h-[58px] rounded-[20px] p-5 bg-white border border-[#b9b9b9] mb-4 text-[22px] font-medium text-left text-[#b9b9b9]"
                  autoComplete="current-password"
                />
                {
                  hide ?
                    <div className="cursor-pointer absolute top-[20px] right-5 text-[21px] text-[#7c7c7c]" onClick={() => setHide(false)}><FaRegEyeSlash /></div>
                    : <div className="cursor-pointer absolute top-[20px] right-5 text-[21px] text-[#7c7c7c]" onClick={() => setHide(true)}><FaRegEye /></div>
                }
              </div>
              {error && (
                <p className="text-[17px] font-medium text-left text-red-500">
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="w-[330px] h-[55px] rounded-[20px] bg-[#ffe96f] text-[23px] font-bold mb-5"
              >
                로그인
              </button>
            </form>

            <div className="mt-2 flex flex-row">
              <button
                type="button"
                className="mr-[10px] border-[1px] border-[#A1A1A1] w-[160px] h-[38px] rounded-[7px] text-[15px] font-bold mb-3 bg-[#fff] flex flex-row items-center justify-center transform hover:scale-105 transition-transform duration-200"
                onClick={() => handleSocialLogin("google")}
              >
                <FcGoogle className="mr-3 text-[20px]" />
                구글로 로그인
              </button>
              <button
                type="button"
                className="border-[1px] border-[#A1A1A1] w-[160px] h-[38px] rounded-[7px] text-[15px] font-bold mb-3 bg-[#fff] flex flex-row items-center justify-center transform hover:scale-105 transition-transform duration-200"
                onClick={() => handleSocialLogin("kakao")}
              >
                <RiKakaoTalkFill className="mr-3 text-[20px]" />
                카카오로 로그인
              </button>
            </div>
            <Link to="/join" onClick={handleJoinLinkClick}>
              <p className="text-[20px] font-medium text-left text-[#363636]">
                키즈링크가 처음이라면?
              </p>
            </Link>
            
          </div>
        )}
      </div>
    </>
  );
};

