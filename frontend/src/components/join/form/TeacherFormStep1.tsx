import { useState } from "react"
import { useNavigate } from "react-router-dom"
import useAppStore from "../../../stores/store"
import ProgressBar from "../ProgressBar"
import ProfileImageUpload from "../ProfileImageUpload"
import MainInfo from "../MainInfo"
import SubInfo from "../SubInfo"
import defaultProfileImg from "../../../assets/join/default-profile.png"

interface TeacherFormStep1Props {
  onNext: () => void;
}

export default function TeacherFormStep1({ onNext }: TeacherFormStep1Props) {
  const navigate = useNavigate()
  const [isUsernameChecked, setIsUsernameChecked] = useState<boolean>(false)
  const [emailLocal, setEmailLocal] = useState<string>("")
  const [emailDomain, setEmailDomain] = useState<string>("")
  const [telFirst, setTelFirst] = useState<string>("")
  const [telSecond, setTelSecond] = useState<string>("")
  const [telThird, setTelThird] = useState<string>("")
  const {
    username,
    password,
    setUsername,
    setPassword,

    name,
    nickname,
    passwordConfirm,
    profile,
    setEmail,
    setName,
    setNickname,
    setTel,
    setPasswordConfirm,
    setProfile,

    isSocialLogin // 추가
  } = useAppStore()

  const handleCancel = () => {
    navigate("/join")
  }

  const handleNext = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!isUsernameChecked) {
      alert("아이디 중복 확인을 해주세요.")
      return
    }

    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }

    if (!username || !password || !passwordConfirm || !name) {
      alert("모든 필수 항목을 입력해주세요.")
      return
    }

    if (!profile) {
      const response = await fetch(defaultProfileImg)
      const blob = await response.blob()
      const defaultProfileFile = new File([blob], "default-profile.png", {
        type: "image/png",
      })
      setProfile(defaultProfileFile)
    }

    if (!nickname) {
      setNickname(name)
    }

    if (telFirst && telSecond && telThird) {
      const combinedTel = `${telFirst}-${telSecond}-${telThird}`
      setTel(combinedTel)
    } else if (telFirst || telSecond || telThird) {
      alert("휴대폰번호를 정확히 입력해 주세요.")
      return
    } else {
      setTel("")
    }

    onNext()
  }

  const handleEmailChange = () => {
    const combinedEmail = `${emailLocal}@${emailDomain}`
    setEmail(combinedEmail)
  }

  return (
    <form onSubmit={handleNext} className="w-full p-6 mx-auto">
      {/* 회원가입 진행률 */}
      <ProgressBar
        steps={["선생님정보입력", "유치원정보입력", "가입완료"]}
        currentStep={0}
      />

      {/* 1단계 */}
      <p className="mt-5 text-base font-bold">선생님 정보입력</p>
      <p className="mt-1 text-xs font-normal text-gray-400">
        선생님 서비스에 필요한 정보를 입력합니다.
      </p>

      {/* 프로필 이미지 업로드 */}
      <ProfileImageUpload profile={profile} setProfile={setProfile} />

      {/* 아이디 및 비밀번호 입력 */}
      <MainInfo
        username={username}
        password={password}
        passwordConfirm={passwordConfirm}
        setUsername={setUsername}
        setPassword={setPassword}
        setPasswordConfirm={setPasswordConfirm}
        setIsUsernameChecked={setIsUsernameChecked}
      />

      {/* 이름, 닉네임, 이메일, 휴대폰 번호 입력 */}
      <SubInfo
        name={name}
        nickname={nickname}
        emailLocal={emailLocal}
        emailDomain={emailDomain}
        telFirst={telFirst}
        telSecond={telSecond}
        telThird={telThird}
        setName={setName}
        setNickname={setNickname}
        setEmailLocal={setEmailLocal}
        setEmailDomain={setEmailDomain}
        setTelFirst={setTelFirst}
        setTelSecond={setTelSecond}
        setTelThird={setTelThird}
        handleEmailChange={handleEmailChange}
        isSocialLogin={isSocialLogin} // 추가
      />

      <div className="border-b-2 border-black mt-8"></div>
      <div className="flex justify-end my-6">
        <button
          type="button"
          onClick={handleCancel}
          className="w-24 h-9 bg-[#757575] text-white font-bold rounded-md mr-2"
        >
          취소
        </button>
        <button
          type="submit"
          className="w-24 h-9 bg-[#F8DE56] text-gray-800 font-bold rounded-md"
        >
          다음
        </button>
      </div>
    </form>
  )
}
