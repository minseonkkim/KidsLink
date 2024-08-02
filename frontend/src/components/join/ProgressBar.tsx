// 회원가입 진행률

import { FaCheck } from "react-icons/fa"

interface ProgressBarProps {
  steps: string[];
  currentStep: number;
}

export default function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  return (
    <div className="relative flex h-[62px] mx-3">
      {/* 회원가입 1단계일 경우 */}
      {currentStep === 0 && (
        <>
          <div className="flex-1 relative">
            <div className="border-t-[3px] border-[#D9D9D9] absolute left-[25px] right-0 transform -translate-y-1/2"></div>
            <div className="absolute left-[25px] top-[-12px] flex items-center justify-center w-6 h-6 bg-[#F8DE56] rounded-full">
              <div className="flex items-center justify-center w-4 h-4 bg-white rounded-full">
                <div className="w-2 h-2 bg-[#F8DE56] rounded-full"></div>
              </div>
            </div>
            <p className="mt-6 text-sm font-normal text-left text-black">
              {steps[0]}
            </p>
          </div>
          <div className="flex-1 relative">
            <div className="border-t-[3px] border-[#D9D9D9] absolute left-0 right-0 transform -translate-y-1/2"></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 top-[-6px] flex items-center justify-center w-3 h-3 bg-gray-300 rounded-full"></div>
            <p className="mt-6 text-sm font-light text-center text-[#B8B8B8]">
              {steps[1]}
            </p>
          </div>
          <div className="flex-1 relative">
            <div className="border-t-[3px] border-[#D9D9D9] absolute left-0 right-[15px] transform -translate-y-1/2"></div>
            <div className="absolute right-[15px] top-[-6px] flex items-center justify-center w-3 h-3 bg-gray-300 rounded-full"></div>
            <p className="mt-6 text-sm font-light text-right text-[#B8B8B8]">
              {steps[2]}
            </p>
          </div>
        </>
      )}

      {/* 회원가입 2단계일 경우 */}
      {currentStep === 1 && (
        <>
          <div className="flex-1 relative">
            <div className="border-t-[3px] border-[#F8DE56] absolute left-[25px] right-0 transform -translate-y-1/2"></div>
            <div className="absolute left-[25px] top-[-12px] flex items-center justify-center w-6 h-6 bg-[#F8DE56] rounded-full">
              <FaCheck className="w-3 h-3 text-white" />
            </div>
            <p className="mt-6 text-sm font-normal text-left text-[#B8B8B8]">
              {steps[0]}
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
              {steps[1]}
            </p>
          </div>
          <div className="flex-1 relative">
            <div className="border-t-[3px] border-[#D9D9D9] absolute left-0 right-[15px] transform -translate-y-1/2"></div>
            <div className="absolute right-[15px] top-[-6px] flex items-center justify-center w-3 h-3 bg-gray-300 rounded-full"></div>
            <p className="mt-6 text-sm font-light text-right text-[#B8B8B8]">
              {steps[2]}
            </p>
          </div>
        </>
      )}

      {/* 회원가입 3단계일 경우 */}
      {currentStep === 2 && (
        <>
          <div className="flex-1 relative">
            <div className="border-t-[3px] border-[#F8DE56] absolute left-[25px] right-0 transform -translate-y-1/2"></div>
            <div className="absolute left-[25px] top-[-12px] flex items-center justify-center w-6 h-6 bg-[#F8DE56] rounded-full">
              <FaCheck className="w-3 h-3 text-white" />
            </div>
            <p className="mt-6 text-sm font-normal text-left text-[#B8B8B8]">
              {steps[0]}
            </p>
          </div>
          <div className="flex-1 relative">
            <div className="border-t-[3px] border-[#F8DE56] absolute left-0 right-0 transform -translate-y-1/2"></div>
            <div className="absolute left-1/2 transform -translate-x-[48%] top-[-12px] flex items-center justify-center w-6 h-6 bg-[#F8DE56] rounded-full">
              <FaCheck className="w-3 h-3 text-white" />
            </div>
            <p className="mt-6 text-sm font-light text-center text-[#B8B8B8]">
              {steps[1]}
            </p>
          </div>
          <div className="flex-1 relative">
            <div className="border-t-[3px] border-[#F8DE56] absolute left-0 right-[15px] transform -translate-y-1/2"></div>
            <div className="absolute right-[14px] top-[-12px] flex items-center justify-center w-6 h-6 bg-[#F8DE56] rounded-full">
              <div className="flex items-center justify-center w-4 h-4 bg-white rounded-full">
                <div className="w-2 h-2 bg-[#F8DE56] rounded-full"></div>
              </div>
            </div>
            <p className="mt-6 text-sm font-light text-right text-black">
              {steps[2]}
            </p>
          </div>
        </>
      )}
    </div>
  )
}
