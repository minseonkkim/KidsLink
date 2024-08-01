// 이름, 닉네임, 이메일, 핸드폰 번호 입력

import { useState } from "react"

interface SubInfoProps {
  name: string;
  nickname: string;
  emailLocal: string;
  emailDomain: string;
  telFirst: string;
  telSecond: string;
  telThird: string;
  setName: (name: string) => void;
  setNickname: (nickname: string) => void;
  setEmailLocal: (emailLocal: string) => void;
  setEmailDomain: (emailDomain: string) => void;
  setTelFirst: (telFirst: string) => void;
  setTelSecond: (telSecond: string) => void;
  setTelThird: (telThird: string) => void;
  handleEmailChange: () => void;

  isSocialLogin: boolean; // 추가
}

export default function SubInfo({
  name,
  nickname,
  emailLocal,
  emailDomain,
  telFirst,
  telSecond,
  telThird,
  setName,
  setNickname,
  setEmailLocal,
  setEmailDomain,
  setTelFirst,
  setTelSecond,
  setTelThird,
  handleEmailChange,

  isSocialLogin // 추가
}: SubInfoProps) {
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true)

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-.]+$/
    return emailRegex.test(email)
  }

  const handleEmailLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmailLocal = e.target.value
    setEmailLocal(newEmailLocal)
    handleEmailValidation(newEmailLocal, emailDomain)
  }

  const handleEmailDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmailDomain = e.target.value
    setEmailDomain(newEmailDomain)
    handleEmailValidation(emailLocal, newEmailDomain)
  }

  const handleEmailValidation = (local: string, domain: string) => {
    if (local === "" && domain === "") {
      setIsEmailValid(true)
      return
    }

    const email = `${local}@${domain}`
    const isValid = validateEmail(email)
    setIsEmailValid(isValid)
    handleEmailChange()
  }

  return (
    <>
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-400">
          이름 <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          className="mt-2 border border-gray-400 rounded-md p-1 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
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
          autoComplete="nickname"
        />
      </div>

      {!isSocialLogin && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-400">
            이메일
          </label>
          <div className="flex mt-2 space-x-2">
            <input
              type="text"
              className="flex-grow min-w-0 border border-gray-400 rounded-md p-1"
              value={emailLocal}
              onChange={handleEmailLocalChange}
              autoComplete="email-local"
            />
            <span className="self-center text-base font-medium text-gray-400">
              @
            </span>
            <input
              type="text"
              className="w-24 border border-gray-400 rounded-md p-1"
              value={emailDomain}
              onChange={handleEmailDomainChange}
              autoComplete="email-domain"
            />
          </div>
          {!isEmailValid && (emailLocal !== "" || emailDomain !== "") && (
            <p className="text-red-600 text-xs mt-1">올바른 이메일 형식을 입력해주세요.</p>
          )}
        </div>
      )}
      
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
            autoComplete="tel-first"
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
            autoComplete="tel-second"
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
            autoComplete="tel-third"
          />
        </div>
      </div>
    </>
  )
}
