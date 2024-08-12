import { useEffect, useState } from 'react';
import Title from "../../components/teacher/common/Title";
import TeacherLayout from '../../layouts/TeacherLayout';
import daramgi from "../../assets/teacher/playing-daramgi.png";
import ThreeModel from "../../components/ThreeModel";
import FirstStep from '../../components/teacher/support/FirstStep';
import SecondStep from '../../components/teacher/support/SecondStep';
import ThirdStep from '../../components/teacher/support/ThirdStep';
import FourthStep from '../../components/teacher/support/FourthStep';
import { Vector2 } from 'three';
import { useNavigate } from 'react-router-dom';

export default function TeacherSupport() {
  const [mousePosition, setMousePosition] = useState(new Vector2(0, 0));
  const [step, setStep] = useState(1);
  const [helpNeeded, setHelpNeeded] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePosition(new Vector2(x, y));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleNextStep = () => {
    setStep((prevStep) => Math.min(prevStep + 1, 6));
  };

  const handlePreviousStep = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const getStepComponent = () => {
    switch (step) {
      case 2:
        return <FirstStep />;
      case 3:
        return <SecondStep />;
      case 4:
        return <ThirdStep />;
      case 5:
        return <FourthStep />;
      case 6:
        return (
          <div className="text-center mt-44 z-50">
            <p className="text-lg font-semibold mb-8">
              화상상담 조작법 설명이 다 끝났습니다!
            </p>
            <button
              className="z-50 px-4 py-2 rounded-full bg-[#FFD700] text-gray-800 hover:bg-[#FFB800] hover:text-gray-900 transition duration-300"
              onClick={() => navigate('/meeting')}
            >
              화상상담 페이지로 이동
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const getStepMessage = () => {
    switch (step) {
      case 2:
        return (
          <div className='z-50 text-[#1F1F1F] font-semibold'>
            <div className='text-[#333333] text-[20px] mb-6'>⏰ 1단계: 상담가능시간 Open</div>
            <div className='text-[16px] mb-4'>학부모님들에게 상담가능한 시간을 알려주세요!</div>
            <div className='text-[16px] mb-2'>📢 첫째, 상담이 가능한 시간대를 선택합니다.</div>
            <div className='text-[16px]'>📢 둘째, open을 누르면 가능시간대가 학부모님들에게 전송됩니다!</div>
          </div>
        );
      case 3:
        return (
          <div className='z-50 text-[#1F1F1F] font-semibold'> 
            <div className='text-[#333333] text-[20px] mb-6'>📅 2단계: 희망시간을 바탕으로 일정을 조율해주세요!</div>
            <div className='text-[16px] mb-2'>📢 첫째, 학부모님들의 희망 시간대를 겹치지 않도록 선택해주세요.</div>
            <div className='text-[16px] mb-4'>📢 둘째, 확정하기 버튼을 누르면 상담이 확정됩니다.</div>
            <div className='text-[16px]'>
              일정 조율하기 버튼을 누르면 키즈링크만의 알고리즘을 통해 자동으로 일정을 조율합니다.
              <br />
              내가 선택한 시간을 우선적으로 선택 후 남은 시간대를 조율합니다.
            </div>
          </div>
        );
      case 4:
        return (
          <div className='z-50 text-[#1F1F1F] font-semibold'> 
            <div className='text-[#333333] text-[20px] mb-6'>💻 3단계: 상담시간에 맞춰 화상상담을 진행해보세요!</div>
            <div className='text-[16px] mb-2'><p className="text-red-600 mb-2">&lt;주의&gt;</p>폭언을 감지하여 전후를 녹화합니다. 녹화중지 버튼을 누르면 녹화를 중지합니다.</div>
            <div className='text-[16px]'>실수로 나가더라도 다시 들어갈 수 있어요!</div>
          </div>
        );
      case 5:
        return (
          <div className='z-50 text-[#1F1F1F] font-semibold'>
            <div className='text-[#333333] text-[20px] mb-6'>📹 4단계: 녹화된 파일을 볼 수 있어요!</div>
            <div className='text-[16px] mb-2'>폭언 내용을 기준으로 녹화된 파일을 확인할 수 있습니다!</div>
            <div className='text-[16px]'>상담시 바른말 고운말만 사용해주세요~!</div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <TeacherLayout
      activeMenu="meeting"
      setActiveMenu={() => {}}
      titleComponent={<Title title="화상상담 튜토리얼" />}
      imageSrc={daramgi}
    >
      
      <div className={`relative flex flex-col items-center justify-center w-full h-full px-4 lg:px-8 ${step === 1 || step === -1 ? 'overflow-hidden' : ''}`}>
        {step === 1 && (
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-50">
            <p className="text-lg font-semibold mb-4 text-black font-medium">
              저는 화상상담 조작법을 설명해 드릴 수 있어요!<br />
              도움이 필요하신가요?
            </p>
            <div className="flex justify-center space-x-8 mt-8">
              <button
                className="px-4 py-2 rounded-full bg-[#FFD700] text-gray-800 hover:bg-[#FFB800] hover:text-gray-900 transition duration-300"
                onClick={() => {
                  setHelpNeeded(true);
                  setStep(2);
                }}
              >
                네
              </button>
              <button
                className="px-4 py-2 rounded-full bg-[#FFD700] text-gray-800 hover:bg-[#FFB800] hover:text-gray-900 transition duration-300"
                onClick={() => {
                  setHelpNeeded(false);
                  navigate("/meeting");
                }}
              >
                아니오
              </button>
            </div>
          </div>
        )}

        {helpNeeded && step > 1 && (
          <>
            <div className="w-full h-full flex justify-center items-center z-20">
              {getStepComponent()}
            </div>
            {step < 6 && (
              <div className="fixed top-56 w-[520px] left-1/2 transform -translate-x-1/2 p-4 z-50">
                <div className="rounded-3xl bg-[#FAF3E0] text-[#1F1F1F] bg-opacity-85 backdrop-blur-lg border border-white border-opacity-20 p-6 shadow-lg">
                  {getStepMessage()}
                  <div className="flex justify-between mt-8">
                    <button
                      className="px-4 py-2 rounded-full bg-[#FFD700] text-gray-800 hover:bg-[#FFB800] hover:text-gray-900 transition duration-300"
                      onClick={handlePreviousStep}
                    >
                      이전
                    </button>
                    <button
                      className="px-4 py-2 rounded-full bg-[#FFD700] text-gray-800 hover:bg-[#FFB800] hover:text-gray-900 transition duration-300"
                      onClick={handleNextStep}
                    >
                      다음
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div className={`fixed ${step === 1 || step === 6 ? 'bottom-36' : 'top-60 right-60'} z-30`}>
          <ThreeModel mousePosition={mousePosition} />
        </div>
      </div>
    </TeacherLayout>
  );
}
