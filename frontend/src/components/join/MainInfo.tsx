// 아이디, 비밀번호 입력

import { useState } from "react"
import { checkUsernameExists } from "../../api/member"

interface MainInfoProps {
  username: string;
  password: string;
  passwordConfirm: string;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  setPasswordConfirm: (passwordConfirm: string) => void;
  setIsUsernameChecked: (isChecked: boolean) => void;
}

export default function MainInfo({
  username,
  password,
  passwordConfirm,
  setUsername,
  setPassword,
  setPasswordConfirm,
  setIsUsernameChecked,
}: MainInfoProps) {
  const [usernameError, setUsernameError] = useState<string | null>(null)

  const handleUsernameCheck = async () => {
    if (!username) {
      setUsernameError("아이디를 입력해주세요.")
      return;
    }

    try {
      const exists = await checkUsernameExists(username);
      if (exists) {
        setUsernameError("중복된 아이디입니다.")
        setIsUsernameChecked(false);
      } else {
        setUsernameError("사용가능한 아이디입니다.")
        setIsUsernameChecked(true);
      }
    } catch (error) {
      console.error("Failed to check username", error)
      setUsernameError("아이디 확인 중 오류가 발생했습니다.")
      setIsUsernameChecked(false)
    }
  }

  return (
    <>
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
              setUsername(e.target.value)
              setIsUsernameChecked(false)
            }}
            autoComplete="username"
          />
          <button
            type="button"
            onClick={handleUsernameCheck}
            className="ml-2 px-2 w-20 bg-[#363636] text-white text-xs font-bold rounded-md whitespace-pre"
          >
            중복확인
          </button>
        </div>
        {usernameError && (
          <p
            className={`mt-2 text-xs ${
              usernameError === "사용가능한 아이디입니다." ? "text-green-600" : "text-red-600"
            }`}
          >
            {usernameError}
          </p>
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
          autoComplete="new-password"
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
          autoComplete="new-password"
        />
      </div>
    </>
  )
}