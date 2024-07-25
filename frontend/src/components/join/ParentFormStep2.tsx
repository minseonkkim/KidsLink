import { ChangeEvent, FC, useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import { useAppStore } from "../../stores/store";
import { parentSignup } from '../../api/member/member';

interface ParentFormStep2Props {
  onNext: () => void;
  onBack: () => void;
}

const ParentFormStep2: FC<ParentFormStep2Props> = ({ onBack, onNext }) => {
  const {
    gender, setGender,
    childName, setChildName,
    birth, setBirth,
    kindergartenName, setKindergartenName,
    className, setClassName,
    username, password, passwordConfirm, email, name, nickname, tel, profile,
  } = useAppStore();

  const [birthYear, setBirthYear] = useState(birth.slice(0, 4) || '');
  const [birthMonth, setBirthMonth] = useState(birth.slice(5, 7) || '');
  const [birthDay, setBirthDay] = useState(birth.slice(8, 10) || '');

  useEffect(() => {
    const combinedBirth = `${birthYear}-${birthMonth}-${birthDay}`;
    setBirth(combinedBirth);
  }, [birthYear, birthMonth, birthDay, setBirth]);

  const handleGenderChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGender(event.target.value);
  };

  const handleSignup = async () => {
    const parentData = {
      username,
      name,
      password,
      passwordConfirm,
      email,
      profile,
      nickname,
      tel,
      child: {
        name: childName,
        kindergartenClassName: className,
        kindergartenName,
        gender,
        birth,
      },
    };

    try {
      await parentSignup(parentData);
      onNext(); // 회원가입 성공 후 다음 단계로 이동
    } catch (error) {
      console.error("Signup failed", error);
    }
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
          <div className="border-t-[3px] border-custom-gradient absolute left-0 right-0 transform -translate-y-1/2"></div>
          <div className="absolute left-1/2 transform -translate-x-[48%] top-[-12px] flex items-center justify-center w-6 h-6 bg-[#F8DE56] rounded-full">
            <div className="flex items-center justify-center w-4 h-4 bg-white rounded-full">
              <div className="w-2 h-2 bg-[#F8DE56] rounded-full"></div>
            </div>
          </div>
          <p className="mt-6 text-sm font-light text-center text-black">자녀정보입력</p>
        </div>
        <div className="flex-1 relative">
          <div className="border-t-[3px] border-[#D9D9D9] absolute left-0 right-[15px] transform -translate-y-1/2"></div>
          <div className="absolute right-[15px] top-[-6px] flex items-center justify-center w-3 h-3 bg-gray-300 rounded-full"></div>
          <p className="mt-6 text-sm font-light text-right text-[#B8B8B8]">가입완료</p>
        </div>
      </div>

      {/* 2단계 */}
      <p className="mt-5 text-base font-bold">자녀 정보입력</p>
      <p className="mt-1 text-xs font-normal text-gray-400">학부모 서비스에 필요한 정보를 입력합니다.</p>
      
      <div className="mt-8">
        <label className="block text-sm font-medium text-gray-400">성별</label>
        <div className="flex items-center mt-2">
          <input
            type="radio"
            name="gender"
            value="M"
            id="genderMale"
            className="hidden"
            checked={gender === 'M'}
            onChange={handleGenderChange}
          />
          <label htmlFor="genderMale" className="flex items-center cursor-pointer ml-2 relative">
            <div className={`w-4 h-4 mr-2 rounded-full border-2 ${gender === 'M' ? 'border-[#F8DE56]' : 'border-gray-400'} flex items-center justify-center`}>
              <div className={`w-2 h-2 rounded-full ${gender === 'M' ? 'bg-[#F8DE56]' : ''}`}></div>
            </div>
            <p className="text-base font-medium">남성</p>
          </label>

          <input
            type="radio"
            name="gender"
            value="F"
            id="genderFemale"
            className="hidden"
            checked={gender === 'F'}
            onChange={handleGenderChange}
          />
          <label htmlFor="genderFemale" className="flex items-center cursor-pointer ml-8 relative">
            <div className={`w-4 h-4 mr-2 rounded-full border-2 ${gender === 'F' ? 'border-[#F8DE56]' : 'border-gray-400'} flex items-center justify-center`}>
              <div className={`w-2 h-2 rounded-full ${gender === 'F' ? 'bg-[#F8DE56]' : ''}`}></div>
            </div>
            <p className="text-base font-medium">여성</p>
          </label>
        </div>
      </div>

      <div className="mt-5">
        <label className="block text-sm font-medium text-gray-400">이름</label>
        <input
          type="text"
          className="mt-2 w-full border border-gray-400 rounded-md p-1"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
        />
      </div>

      <div className="mt-5">
        <label className="block text-sm font-medium text-gray-400">생년월일</label>
        <div className="flex mt-2 space-x-2">
          <input
            type="text"
            placeholder="년(4자)"
            className="w-1/3 border border-gray-400 rounded-md p-1"
            maxLength={4}
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
          />
          <input
            type="text"
            placeholder="월"
            className="w-1/3 border border-gray-400 rounded-md p-1"
            maxLength={2}
            value={birthMonth}
            onChange={(e) => setBirthMonth(e.target.value)}
          />
          <input
            type="text"
            placeholder="일"
            className="w-1/3 border border-gray-400 rounded-md p-1"
            maxLength={2}
            value={birthDay}
            onChange={(e) => setBirthDay(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="block text-sm font-medium text-gray-400">유치원</label>
        <div className="flex mt-2 space-x-2">
          <input
            type="text"
            placeholder="유치원 이름"
            className="w-1/2 border border-gray-400 rounded-md p-1"
            value={kindergartenName}
            onChange={(e) => setKindergartenName(e.target.value)}
          />
          <input
            type="text"
            placeholder="반 이름"
            className="w-1/2 border border-gray-400 rounded-md p-1"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          />
        </div>
      </div>

      <div className="border-b-2 border-[#757575] mt-8"></div>
      <div className="flex justify-end my-5">
        <button
          onClick={onBack}
          className="w-24 h-9 bg-[#757575] text-white font-bold rounded-md mr-2"
        >
          뒤로
        </button>
        <button
          onClick={handleSignup}
          className="w-24 h-9 bg-[#F8DE56] text-gray-800 font-bold rounded-md"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default ParentFormStep2;
