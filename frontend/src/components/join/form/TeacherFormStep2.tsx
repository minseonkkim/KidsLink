import { useState } from "react"
import { teacherSignup } from "../../../api/member"
import useAppStore from "../../../stores/store"
import ProgressBar from "../ProgressBar"
import KindergartenSelector from "../KindergartenSelector"

interface TeacherFormStep2Props {
  onNext: () => void;
  onBack: () => void;
}

export default function TeacherFormStep2({ onBack, onNext }: TeacherFormStep2Props) {
  const {
    username,
    password,
    passwordConfirm,
    email,
    name,
    nickname,
    tel,
    profile,

    isSocialLogin // 추가
  } = useAppStore()

  const [selectedKindergartenId, setSelectedKindergartenId] = useState<number | null>(null)
  const [selectedKindergartenClassId, setSelectedKindergartenClassId] = useState<number | null>(null)

  const handleSignup = async () => {
    if (
      selectedKindergartenId === null ||
      selectedKindergartenClassId === null
    ) {
      alert("모든 필수 항목을 입력해주세요.")
      return
    }

    const teacherData = {
      username,
      name,
      password,
      passwordConfirm,
      email,
      profile,
      nickname,
      tel,
      kindergartenClassId: selectedKindergartenClassId,
      kindergartenId: selectedKindergartenId,
    }

    const socialData = { // 추가
      role: "ROLE_TEACHER",
      profile,
      name,
      nickname,
      tel,
      kindergartenClassId: selectedKindergartenClassId,
      kindergartenId: selectedKindergartenId,
    }
    
    try {
      if (!isSocialLogin) {
        await teacherSignup(teacherData); // 일반 사용자용 함수 호출
      } else {
        // 소셜 로그인을 위한 회원가입 함수 호출 (socialData 사용)
      }
      console.log(socialData) // socialData 확인용
      onNext(); // 지금은 소셜 회원가입 함수에서 error안걸려서 다음 페이지 넘아감
    } catch (error) {
      console.error("Signup failed", error);
    }
  }

  return (
    <div className="w-full p-6 mx-auto">
      {/* 회원가입 진행률 */}
      <ProgressBar
        steps={["선생님정보입력", "유치원정보입력", "가입완료"]}
        currentStep={1}
      />

      {/* 2단계 */}
      <p className="mt-5 text-base font-bold">유치원 정보입력</p>
      <p className="mt-1 text-xs font-normal text-gray-400">
        선생님 서비스에 필요한 정보를 입력합니다.
      </p>

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

