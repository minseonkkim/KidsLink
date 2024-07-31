import { ChangeEvent, FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiCamera } from "react-icons/ci";
import useAppStore from "../../stores/store";
import { checkUsernameExists } from "../../api/member"; // 아이디 중복 검사 함수 import
import defaultProfileImg from "../../assets/join/default-profile.png";


interface ParentFormStep1Props {
  onNext: () => void;
}

const ParentFormStep1: FC<ParentFormStep1Props> = ({ onNext }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [emailLocal, setEmailLocal] = useState<string>("");
  const [emailDomain, setEmailDomain] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isUsernameChecked, setIsUsernameChecked] = useState<boolean>(false);
  const [telFirst, setTelFirst] = useState<string>("");
  const [telSecond, setTelSecond] = useState<string>("");
  const [telThird, setTelThird] = useState<string>("");
  const navigate = useNavigate();
  const {
    username,
    password,
    setUsername,
    setPassword,
    name,
    nickname,
    passwordConfirm,
    setEmail,
    setName,
    setNickname,
    setTel,
    setPasswordConfirm,
    setProfile,
    profile,
  } = useAppStore();

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newImage = URL.createObjectURL(file);
      setImagePreview(newImage);
      setProfile(file);
    }
  }

  const handleCancel = () => {
    navigate("/join");
  };

  const handleNext = async () => {
    if (!isUsernameChecked) {
      alert("아이디 중복 확인을 해주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!username || !password || !passwordConfirm || !name) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    if (!profile) {
      const response = await fetch(defaultProfileImg);
      const blob = await response.blob();
      const defaultProfileFile = new File([blob], "default-profile.png", {
        type: "image/png",
      });
      setProfile(defaultProfileFile);
    }

    if (!nickname) {
      setNickname(name);
    }

    if (telFirst && telSecond && telThird) {
      const combinedTel = `${telFirst}-${telSecond}-${telThird}`;
      setTel(combinedTel);
    } else if (telFirst || telSecond || telThird) {
      alert("휴대폰번호를 정확히 입력해 주세요.");
      return;
    } else {
      setTel("");
    }

    onNext();
  };

  const handleEmailChange = () => {
    const combinedEmail = `${emailLocal}@${emailDomain}`;
    setEmail(combinedEmail);
  };

  const handleUsernameCheck = async () => {
    if (!username) {
      setUsernameError("아이디를 입력해주세요.");
      return;
    }

    try {
      const exists = await checkUsernameExists(username);
      if (exists) {
        setUsernameError("중복된 아이디입니다.");
        setIsUsernameChecked(false);
      } else {
        setUsernameError("사용가능한 아이디입니다.");
        setIsUsernameChecked(true);
      }
    } catch (error) {
      console.error("Failed to check username", error);
      setUsernameError("아이디 확인 중 오류가 발생했습니다.");
      setIsUsernameChecked(false);
    }
  };

  return (
    <div className="w-full p-6 mx-auto">
      {/* 회원가입 진행률 */}
      <div className="relative flex h-[62px] mx-3">
        <div className="flex-1 relative">
          <div className="border-t-[3px] border-[#D9D9D9] absolute left-[25px] right-0 transform -translate-y-1/2"></div>
          <div className="absolute left-[25px] top-[-12px] flex items-center justify-center w-6 h-6 bg-[#F8DE56] rounded-full">
            <div className="flex items-center justify-center w-4 h-4 bg-white rounded-full">
              <div className="w-2 h-2 bg-[#F8DE56] rounded-full"></div>
            </div>
          </div>
          <p className="mt-6 text-sm font-normal text-left text-black">
            학부모정보입력
          </p>
        </div>
        <div className="flex-1 relative">
          <div className="border-t-[3px] border-[#D9D9D9] absolute left-0 right-0 transform -translate-y-1/2"></div>
          <div className="absolute left-1/2 transform -translate-x-1/2 top-[-6px] flex items-center justify-center w-3 h-3 bg-gray-300 rounded-full"></div>
          <p className="mt-6 text-sm font-light text-center text-[#B8B8B8]">
            자녀정보입력
          </p>
        </div>
        <div className="flex-1 relative">
          <div className="border-t-[3px] border-[#D9D9D9] absolute left-0 right-[15px] transform -translate-y-1/2"></div>
          <div className="absolute right-[15px] top-[-6px] flex items-center justify-center w-3 h-3 bg-gray-300 rounded-full"></div>
          <p className="mt-6 text-sm font-light text-right text-[#B8B8B8]">
            가입완료
          </p>
        </div>
      </div>

      {/* 1단계 */}
      <p className="mt-5 text-base font-bold">부모 정보입력</p>
      <p className="mt-1 text-xs font-normal text-gray-400">
        학부모 서비스에 필요한 정보를 입력합니다.
      </p>

      {/* 프로필 이미지 업로드 */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-400">
          프로필 이미지
        </label>
        <div className="flex flex-col items-center mt-2">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="profileImage"
            onChange={handleImageUpload}
          />
          <label htmlFor="profileImage" className="cursor-pointer">
            <div className="flex items-center justify-center w-24 h-24 bg-gray-200 border border-gray-400 rounded-full overflow-hidden">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <CiCamera className="text-3xl" />
                  <span className="text-sm">이미지 업로드</span>
                </div>
              )}
            </div>
          </label>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-400">
          아이디 <span className="text-red-600">*</span>
        </label>
        <div className="relative mt-2 flex">
          <input
            type="text"
            className="flex-1 border border-gray-400 rounded-md p-1"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setIsUsernameChecked(false); // 아이디 변경 시 중복 확인 여부 초기화
            }}
          />
          <button
            onClick={handleUsernameCheck}
            className="ml-2 w-20 bg-[#363636] text-white text-xs font-bold rounded-md"
          >
            중복확인
          </button>
        </div>
        {usernameError && (
          <p className="mt-2 text-xs text-red-600">{usernameError}</p>
        )}
      </div>
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-400">
          비밀번호 <span className="text-red-600">*</span>
        </label>
        <input
          type="password"
          className="mt-2 border border-gray-400 rounded-md p-1 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-400">
          비밀번호 확인 <span className="text-red-600">*</span>
        </label>
        <input
          type="password"
          className="mt-2 border border-gray-400 rounded-md p-1 w-full"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
      </div>
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-400">
          이름 <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          className="mt-2 border border-gray-400 rounded-md p-1 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-400">
          닉네임
        </label>
        <input
          type="text"
          className="mt-2 border border-gray-400 rounded-md p-1 w-full"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-400">
          이메일
        </label>
        <div className="flex mt-2 space-x-2">
          <input
            type="text"
            className="flex-grow border border-gray-400 rounded-md p-1"
            value={emailLocal}
            onChange={(e) => {
              setEmailLocal(e.target.value);
              handleEmailChange();
            }}
          />
          <span className="self-center text-base font-medium text-gray-400">
            @
          </span>
          <input
            type="text"
            className="w-28 border border-gray-400 rounded-md p-1"
            value={emailDomain}
            onChange={(e) => {
              setEmailDomain(e.target.value);
              handleEmailChange();
            }}
          />
        </div>
      </div>
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-400">
          휴대폰 번호
        </label>
        <div className="flex mt-2 space-x-2">
          <input
            type="text"
            className="w-1/3 border border-gray-400 rounded-md p-1"
            value={telFirst}
            onChange={(e) => setTelFirst(e.target.value)}
            maxLength={3}
          />
          <span className="self-center text-base font-medium text-gray-400">
            -
          </span>
          <input
            type="text"
            className="w-1/3 border border-gray-400 rounded-md p-1"
            value={telSecond}
            onChange={(e) => setTelSecond(e.target.value)}
            maxLength={4}
          />
          <span className="self-center text-base font-medium text-gray-400">
            -
          </span>
          <input
            type="text"
            className="w-1/3 border border-gray-400 rounded-md p-1"
            value={telThird}
            onChange={(e) => setTelThird(e.target.value)}
            maxLength={4}
          />
        </div>
      </div>

      <div className="border-b-2 border-[#757575] mt-8"></div>
      <div className="flex justify-end my-6">
        <button
          onClick={handleCancel}
          className="w-24 h-9 bg-[#757575] text-white font-bold rounded-md mr-2"
        >
          취소
        </button>
        <button
          onClick={handleNext}
          className="w-24 h-9 bg-[#F8DE56] text-gray-800 font-bold rounded-md"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default ParentFormStep1;
