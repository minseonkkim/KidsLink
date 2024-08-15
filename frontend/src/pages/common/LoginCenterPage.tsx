import { RiKakaoTalkFill } from "react-icons/ri";
import LoginHeader from "../../components/login/LoginHeader";
import { FcGoogle } from "react-icons/fc";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAppStore from "../../stores/store";
import { login as loginAPI } from "../../api/member";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export default function LoginCenterPage(){
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


    return <>
        <LoginHeader />
        <div className="flex flex-col bg-[#fff9d7] min-h-[calc(100vh-85px)] mt-[85px] h-full z-1 flex items-center justify-center">
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
        </div>
    </>
}