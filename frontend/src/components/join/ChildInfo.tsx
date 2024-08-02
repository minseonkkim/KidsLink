// 자녀 성별, 이름, 생년월일 입력

import { ChangeEvent, useState, useEffect } from "react"

interface ChildInfoProps {
  gender: string;
  setGender: (gender: string) => void;
  childName: string;
  setChildName: (name: string) => void;
  birth: string;
  setBirth: (birth: string) => void;
}

export default function ChildInfo({
  gender,
  setGender,
  childName,
  setChildName,
  setBirth,
}: ChildInfoProps) {
  const [birthYear, setBirthYear] = useState<string>("")
  const [birthMonth, setBirthMonth] = useState<string>("")
  const [birthDay, setBirthDay] = useState<string>("")

  useEffect(() => {
    const combinedBirth = `${birthYear}-${birthMonth}-${birthDay}`
    setBirth(combinedBirth)
  }, [birthYear, birthMonth, birthDay, setBirth])

  const handleGenderChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGender(event.target.value)
  };

  const currentYear = new Date().getFullYear()

  return (
    <div>
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
            {Array.from({ length: 6 }, (_, i) => (
              <option key={i} value={currentYear - 8 + i}>
                {currentYear - 8 + i}
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
    </div>
  )
}
