import React, { useState, useEffect } from "react";
import LoginHeader from "../../components/login/LoginHeader";
import mainImg from "../../assets/teacher/main_img.png";
import { Link, useNavigate } from "react-router-dom";
import { login as loginAPI } from "../../api/member";
import { useAppStore } from "../../stores/store";
import { useMediaQuery } from 'react-responsive';
import Typewriter from 'typewriter-effect';


export default function Login(){
  const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 740px)' });
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 740px)' });
  
  return (
    <>
      {isDesktopOrLaptop && <DesktopComponent />}
      {isTabletOrMobile && <TabletOrMobileComponent />}
    </>
  );
}

const DesktopComponent = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const setUserType = useAppStore((state) => state.setUserType); // Update here

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginAPI({ username, password });
      console.log("Login successful:", data);
      setUserType(data.role); // userType을 Zustand 스토어에 저장
      navigate("/"); // 로그인 성공 후 이동할 경로
    } catch (error) {
      console.error("Error during login:", error);
      setError("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <>
      <LoginHeader />
      <div className="flex flex-row bg-[#fff9d7] min-h-[calc(100vh-85px)] h-full font-KoPubDotum z-1">
        <div className="mx-[150px] py-[100px]">
          <p className="text-[38px] font-bold text-left text-[#363636] mb-[65px] h-[120px]">
            <Typewriter
                options={{
                  strings: ['소중한 추억을 기록하며<br>교육의 모든 순간을 함께하세요.'],
                  autoStart: true,
                  loop: true,
                }}
              />
          </p>

          <form className="flex flex-col" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="로그인"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-[440px] h-[60px] rounded-[20px] p-5 bg-white border border-[#b9b9b9] mb-3 text-[22px] font-medium text-left text-[#b9b9b9]"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-[440px] h-[60px] rounded-[20px] p-5 bg-white border border-[#b9b9b9] mb-5 text-[22px] font-medium text-left text-[#b9b9b9]"
            />
            <button
              type="submit"
              className="w-[440px] h-[57px] rounded-[20px] bg-[#ffe96f] text-[23px] font-bold mb-3"
            >
              로그인
            </button>
          </form>
          {error && (
            <p className="text-[16px] font-medium text-left text-red-500 mb-2">
              {error}
            </p>
          )}
          <Link to="/join">
            <p className="text-[21px] font-medium text-left text-[#363636]">
              키즈링크가 처음이라면?
            </p>
          </Link>
        </div>

        <img
          src={mainImg}
          className="w-[630px] absolute left-[660px] top-[180px] object-cover"
        />
      </div>
    </>
  );
}

const TabletOrMobileComponent = () => {
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const setUserType = useAppStore((state) => state.setUserType); // Update here

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginAPI({ username, password });
      console.log("Login successful:", data);
      setUserType(data.role); // userType을 Zustand 스토어에 저장
      navigate("/"); // 로그인 성공 후 이동할 경로
    } catch (error) {
      console.error("Error during login:", error);
      setError("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContentVisible(false);
    }, 6200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <LoginHeader/>
      <div className="bg-[#FFF9D7] w-[100vw] h-[100vh] flex flex-col items-center justify-center">
        {isContentVisible ? (
          <div className="transition-transform transform grow-animation">
            <p className="text-[27px] font-bold text-center text-[#363636] mb-[65px] h-[80px]">
              <span>소중한 추억을 기록하며</span><br/><span>교육의 모든 순간을 함께하세요.</span>

            </p>
            <img
              src={mainImg}
              className="w-[330px] object-cover"
            />
          </div>): (
            <div>
                <form className="flex flex-col" onSubmit={handleLogin}>
                  <input
                    type="text"
                    placeholder="로그인"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-[330px] h-[58px] rounded-[20px] p-5 bg-white border border-[#b9b9b9] mb-3 text-[22px] font-medium text-left text-[#b9b9b9]"
                  />
                  <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-[330px] h-[58px] rounded-[20px] p-5 bg-white border border-[#b9b9b9] mb-2 text-[22px] font-medium text-left text-[#b9b9b9]"
                  />
                  {error && (
                  <p className="text-[17px] font-medium text-left text-red-500">
                    {error}
                  </p>
                )}
                  <button
                    type="submit"
                    className="mt-5 w-[330px] h-[55px] rounded-[20px] bg-[#ffe96f] text-[23px] font-bold mb-2"
                  >
                    로그인
                  </button>
                </form>
                
                <Link to="/join">
                  <p className="text-[20px] font-medium text-left text-[#363636]">
                    키즈링크가 처음이라면?
                  </p>
                </Link>
            </div>
          )
        }
    </div>
    </>)
}
