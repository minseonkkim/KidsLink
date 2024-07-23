export default function SignupPage() {
  return (
    <>
      {/* 회원가입 진행률 */}
      <div className="relative flex items-center h-[62px] mx-3 mt-6">
        <div className="flex-1 relative">
          <div className="border-t-2 border-[#D9D9D9] absolute left-[25px] right-0 transform -translate-y-1/2"></div>
          <div className="absolute left-[25px] top-[-12px] flex items-center justify-center w-6 h-6 bg-[#F8DE56] rounded-full">
            <div className="flex items-center justify-center w-4 h-4 bg-white rounded-full">
              <div className="w-2 h-2 bg-[#F8DE56] rounded-full"></div>
            </div>
          </div>
          <p className="mt-6 text-sm font-normal text-left text-black">부모정보입력</p>
        </div>
        <div className="flex-1 relative">
          <div className="border-t-2 border-[#D9D9D9] absolute left-0 right-0 transform -translate-y-1/2"></div>
          <div className="absolute left-1/2 transform -translate-x-1/2 top-[-6px] flex items-center justify-center w-3 h-3 bg-gray-300 rounded-full"></div>
          <p className="mt-6 text-sm font-light text-center text-[#B8B8B8]">자녀정보입력</p>
        </div>
        <div className="flex-1 relative">
          <div className="border-t-2 border-[#D9D9D9] absolute left-0 right-[15px] transform -translate-y-1/2"></div>
          <div className="absolute right-[15px] top-[-6px] flex items-center justify-center w-3 h-3 bg-gray-300 rounded-full"></div>
          <p className="mt-6 text-sm font-light text-right text-[#B8B8B8]">가입완료</p>
        </div>
      </div>

      {/* 1단계 */}
      <p className="mt-5 text-base font-bold">부모 정보입력</p>
      <p className="mt-1 text-xs font-normal text-gray-400">학부모 서비스에 필요한 정보를 입력합니다.</p>
      <div className="mt-5">
        <label className="block text-sm font-medium text-gray-400">
          아이디 <span className="text-red-600">*</span>
        </label>
        <div className="relative mt-2 flex">
          <input type="text" className="flex-1 border border-gray-400 rounded-md p-1" />
          <button className="ml-2 w-20 bg-[#363636] text-white text-xs font-bold rounded-md">
            중복확인
          </button>
        </div>
      </div>
      <div className="mt-3">
        <label className="block text-sm font-medium text-gray-400">
          비밀번호 <span className="text-red-600">*</span>
        </label>
        <input
          type="password"
          className="mt-2 border border-gray-400 rounded-md p-1 w-full"
        />
      </div>
      <div className="mt-3">
        <label className="block text-sm font-medium text-gray-400">
          비밀번호 확인 <span className="text-red-600">*</span>
        </label>
        <input
          type="password"
          className="mt-2 border border-gray-400 rounded-md p-1 w-full"
        />
      </div>
      <div className="mt-3">
        <label className="block text-sm font-medium text-gray-400">
          이름 <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          className="mt-2 border border-gray-400 rounded-md p-1 w-full"
        />
      </div>
      <div className="mt-3">
        <label className="block text-sm font-medium text-gray-400">닉네임</label>
        <input
          type="text"
          className="mt-2 border border-gray-400 rounded-md p-1 w-full"
        />
      </div>
      <div className="mt-3">
        <label className="block text-sm font-medium text-gray-400">이메일</label>
        <div className="flex mt-2 space-x-2">
          <input type="text" className="flex-grow border border-gray-400 rounded-md p-1" />
          <span className="self-center text-base font-medium text-gray-400">@</span>
          <input type="text" className="w-28 border border-gray-400 rounded-md p-1" />
        </div>
      </div>
      <div className="mt-3">
        <label className="block text-sm font-medium text-gray-400">휴대폰 번호</label>
        <div className="flex mt-2">
          <input
            type="text"
            className="w-20 border border-gray-400 rounded-md p-1"
          />
          <input
            type="text"
            className="flex-1 border border-gray-400 rounded-md p-1 ml-2"
          />
        </div>
      </div>

      <div className="border-b-2 border-[#757575] mt-8"></div>
      <div className="flex justify-end my-5">
        <button className="w-24 h-9 bg-[#757575] text-white font-bold rounded-md mr-2">
          취소
        </button>
        <button className="w-24 h-9 bg-[#F8DE56] text-gray-800 font-bold rounded-md">
          다음
        </button>
      </div>
    </>
  )
}