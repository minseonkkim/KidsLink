import { ChangeEvent, FC, useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import { useAppStore } from "../../stores/store";
import { parentSignup } from "../../api/member";
import {
  getAllKindergartens,
  getKindergartenClasses,
} from "../../api/kindergarten";

interface ParentFormStep2Props {
  onNext: () => void;
  onBack: () => void;
}

interface Kindergarten {
  kindergartenId: number;
  kindergartenName: string;
}

interface KindergartenClass {
  kindergartenClassId: number;
  kindergartenClassName: string;
}

const ParentFormStep2: FC<ParentFormStep2Props> = ({ onBack, onNext }) => {
  const {
    gender,
    setGender,
    childName,
    setChildName,
    birth,
    setBirth,
    kindergartenName,
    setKindergartenName,
    className,
    setClassName,
    username,
    password,
    passwordConfirm,
    email,
    name,
    nickname,
    tel,
    profile,
  } = useAppStore();

  const [kindergartens, setKindergartens] = useState<Kindergarten[]>([]);
  const [classes, setClasses] = useState<KindergartenClass[]>([]);
  const [selectedKindergartenId, setSelectedKindergartenId] = useState<
    number | null
  >(null);
  const [birthYear, setBirthYear] = useState<string>("");
  const [birthMonth, setBirthMonth] = useState<string>("");
  const [birthDay, setBirthDay] = useState<string>("");

  useEffect(() => {
    const fetchKindergartens = async () => {
      try {
        const data = await getAllKindergartens();
        setKindergartens(data);
      } catch (error) {
        console.error("Failed to fetch kindergartens", error);
      }
    };

    fetchKindergartens();
  }, []);

  useEffect(() => {
    const combinedBirth = `${birthYear}-${birthMonth}-${birthDay}`;
    setBirth(combinedBirth);
  }, [birthYear, birthMonth, birthDay, setBirth]);

  useEffect(() => {
    const fetchClasses = async () => {
      if (selectedKindergartenId !== null) {
        try {
          const data = await getKindergartenClasses(selectedKindergartenId);
          setClasses(data);
        } catch (error) {
          console.error("Failed to fetch classes", error);
        }
      }
    };

    fetchClasses();
  }, [selectedKindergartenId]);

  const handleGenderChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGender(event.target.value);
  };

  const handleKindergartenChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedKindergartenName = event.target.value;
    setKindergartenName(selectedKindergartenName);

    const selectedKindergarten = kindergartens.find(
      (kg) => kg.kindergartenName === selectedKindergartenName
    );

    if (selectedKindergarten) {
      setSelectedKindergartenId(selectedKindergarten.kindergartenId);
    }
  };

  const handleSignup = async () => {
    if (
      !childName ||
      !kindergartenName ||
      !className ||
      !gender ||
      !birthYear ||
      !birthMonth ||
      !birthDay
    ) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

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
    <div className="w-full p-6">
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
          <div className="border-t-[3px] border-custom-gradient absolute left-0 right-0 transform -translate-y-1/2"></div>
          <div className="absolute left-1/2 transform -translate-x-[48%] top-[-12px] flex items-center justify-center w-6 h-6 bg-[#F8DE56] rounded-full">
            <div className="flex items-center justify-center w-4 h-4 bg-white rounded-full">
              <div className="w-2 h-2 bg-[#F8DE56] rounded-full"></div>
            </div>
          </div>
          <p className="mt-6 text-sm font-light text-center text-black">
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

      {/* 2단계 */}
      <p className="mt-5 text-base font-bold">자녀 정보입력</p>
      <p className="mt-1 text-xs font-normal text-gray-400">
        학부모 서비스에 필요한 정보를 입력합니다.
      </p>

      <div className="mt-8">
        <label className="block text-sm font-medium text-gray-400">
          성별 <span className="text-red-600">*</span>
        </label>
        <div className="flex items-center mt-2">
          <input
            type="radio"
            name="gender"
            value="M"
            id="genderMale"
            className="hidden"
            checked={gender === "M"}
            onChange={handleGenderChange}
          />
          <label
            htmlFor="genderMale"
            className="flex items-center cursor-pointer ml-2 relative"
          >
            <div
              className={`w-4 h-4 mr-2 rounded-full border-2 ${
                gender === "M" ? "border-[#F8DE56]" : "border-gray-400"
              } flex items-center justify-center`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  gender === "M" ? "bg-[#F8DE56]" : ""
                }`}
              ></div>
            </div>
            <p className="text-base font-medium">남성</p>
          </label>

          <input
            type="radio"
            name="gender"
            value="F"
            id="genderFemale"
            className="hidden"
            checked={gender === "F"}
            onChange={handleGenderChange}
          />
          <label
            htmlFor="genderFemale"
            className="flex items-center cursor-pointer ml-8 relative"
          >
            <div
              className={`w-4 h-4 mr-2 rounded-full border-2 ${
                gender === "F" ? "border-[#F8DE56]" : "border-gray-400"
              } flex items-center justify-center`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  gender === "F" ? "bg-[#F8DE56]" : ""
                }`}
              ></div>
            </div>
            <p className="text-base font-medium">여성</p>
          </label>
        </div>
      </div>

      <div className="mt-5">
        <label className="block text-sm font-medium text-gray-400">
          이름 <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          className="mt-2 w-full border border-gray-400 rounded-md p-1"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
        />
      </div>

      <div className="mt-5">
        <label className="block text-sm font-medium text-gray-400">
          생년월일 <span className="text-red-600">*</span>
        </label>
        <div className="flex mt-2 space-x-2">
          <select
            className="w-1/3 border border-gray-400 rounded-md p-2 bg-white focus:ring-2 focus:ring-[#F8DE56]"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
          >
            <option value="">년</option>
            {Array.from({ length: 50 }, (_, i) => (
              <option key={i} value={2023 - i}>
                {2023 - i}
              </option>
            ))}
          </select>
          <select
            className="w-1/3 border border-gray-400 rounded-md p-2 bg-white focus:ring-2 focus:ring-[#F8DE56]"
            value={birthMonth}
            onChange={(e) => setBirthMonth(e.target.value)}
          >
            <option value="">월</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={String(i + 1).padStart(2, "0")}>
                {i + 1}
              </option>
            ))}
          </select>
          <select
            className="w-1/3 border border-gray-400 rounded-md p-2 bg-white focus:ring-2 focus:ring-[#F8DE56]"
            value={birthDay}
            onChange={(e) => setBirthDay(e.target.value)}
          >
            <option value="">일</option>
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i} value={String(i + 1).padStart(2, "0")}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label className="block text-sm font-medium text-gray-400">
          유치원 <span className="text-red-600">*</span>
        </label>
        <div className="flex mt-2 space-x-2">
          <select
            className="w-1/2 border border-gray-400 rounded-md p-2 bg-white focus:ring-2 focus:ring-[#F8DE56]"
            value={kindergartenName}
            onChange={handleKindergartenChange}
          >
            <option value="" disabled>
              유치원 선택 
            </option>
            {kindergartens.map((kg) => (
              <option key={kg.kindergartenId} value={kg.kindergartenName}>
                {kg.kindergartenName}
              </option>
            ))}
          </select>
          <select
            className="w-1/2 border border-gray-400 rounded-md p-2 bg-white focus:ring-2 focus:ring-[#F8DE56]"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          >
            <option value="" disabled>
              반 선택 
            </option>
            {classes.map((cls) => (
              <option
                key={cls.kindergartenClassId}
                value={cls.kindergartenClassName}
              >
                {cls.kindergartenClassName}
              </option>
            ))}
          </select>
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
