import { useState } from "react"
import { parentSignup } from "../../../api/member"
import useAppStore from "../../../stores/store"
import ProgressBar from "../ProgressBar"
import ProfileImageUpload from "../ProfileImageUpload"
import KindergartenSelector from "../KindergartenSelector"
import ChildInfo from "../ChildInfo"

interface ParentFormStep2Props {
  onNext: () => void;
  onBack: () => void;
}

export default function ParentFormStep2({ onBack, onNext }: ParentFormStep2Props) {
  const {
    childProfile,
    setChildProfile,
    gender,
    setGender,
    childName,
    setChildName,
    birth,
    setBirth,
    
    // 1단계에서 선택한 부분(parentData 만들기 위해 불러옴)
    username,
    password,
    passwordConfirm,
    email,
    name,
    nickname,
    tel,
    profile,
  } = useAppStore()

  const [selectedKindergartenId, setSelectedKindergartenId] = useState<number | null>(null)
  const [selectedKindergartenClassId, setSelectedKindergartenClassId] = useState<number | null>(null)

  const handleSignup = async () => {
    if (
      !childProfile ||
      !childName ||
      selectedKindergartenId === null ||
      selectedKindergartenClassId === null ||
      !gender ||
      !birth
    ) {
      alert("모든 필수 항목을 입력해주세요.")
      return
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
      childProfile,
      child: {
        name: childName,
        kindergartenClassId: selectedKindergartenClassId,
        kindergartenId: selectedKindergartenId,
        gender,
        birth,
      },
    }

    try {
      await parentSignup(parentData)
      onNext() // 회원가입 성공 후 다음 단계로 이동
    } catch (error) {
      alert("회원가입에 실패했습니다. 다시 시도해 주세요.")
      console.error("Signup failed", error)
    }
  }


  return (
    <div className="w-full p-6">
      {/* 회원가입 진행률 */}
      <ProgressBar
        steps={["학부모정보입력", "자녀정보입력", "가입완료"]}
        currentStep={1}
      />

      {/* 2단계 */}
      <p className="mt-5 text-base font-bold">자녀 정보입력 (프로필 이미지 필수)</p>
      <p className="mt-1 text-xs font-normal text-gray-400">
        학부모 서비스에 필요한 정보를 입력합니다.
      </p>

      {/* 자녀 프로필 이미지 업로드 */}
      <ProfileImageUpload profile={childProfile} setProfile={setChildProfile} />

      {/* 자녀 정보 입력 */}
      <ChildInfo
        gender={gender}
        setGender={setGender}
        childName={childName}
        setChildName={setChildName}
        birth={birth}
        setBirth={setBirth}
      />

      {/* 유치원, 반 선택 */}
      <KindergartenSelector
        selectedKindergartenId={selectedKindergartenId}
        selectedKindergartenClassId={selectedKindergartenClassId}
        setSelectedKindergartenId={setSelectedKindergartenId}
        setSelectedKindergartenClassId={setSelectedKindergartenClassId}
      />

      <div className="border-b-2 border-black mt-8"></div>
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
  )
}
