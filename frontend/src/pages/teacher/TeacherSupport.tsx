import React, { useEffect, useState } from 'react';
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
          <div className="text-center mt-44">
            <p className="text-lg font-semibold mb-8">
              화상상담 조작법 설명이 다 끝났습니다!
            </p>
            <button
              className="z-50 px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-[#8CAD1E] hover:text-white transition duration-300"
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
        return `1단계`;
      case 3:
        return `2단계`;
      case 4:
        return `3단계`;
      case 5:
        return `4단계`;
      default:
        return "";
    }
  };

  return (
    <TeacherLayout
      activeMenu="meeting"
      setActiveMenu={() => {}}
      titleComponent={<Title title="조작법 소개" />}
      imageSrc={daramgi}
    >
      <div className={`relative flex flex-col items-center justify-center w-full h-full px-4 lg:px-8 ${step === 1 || step === -1 ? 'overflow-hidden' : ''}`}>
        {step === 1 && (
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-lg font-semibold mb-4">
              저는 화상상담 조작법을 설명해 드릴 수 있어요!<br />
              도움이 필요하신가요?
            </p>
            <div className="flex justify-center space-x-8 mt-8">
              <button
                className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-[#8CAD1E] hover:text-white transition duration-300"
                onClick={() => {
                  setHelpNeeded(true);
                  setStep(2);
                }}
              >
                네
              </button>
              <button
                className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-[#8CAD1E] hover:text-white transition duration-300"
                onClick={() => {
                  setHelpNeeded(false);
                  setStep(-1);
                }}
              >
                아니오
              </button>
            </div>
          </div>
        )}

        {step === -1 && (
          <div className="absolute bottom-60 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-lg font-semibold">
              알겠습니다! 필요하면 언제든지 다시 말씀해 주세요.
            </p>
          </div>
        )}

        {helpNeeded && step > 1 && (
          <>
            <div className="w-full h-full flex justify-center items-center">
              {getStepComponent()}
            </div>
            {step < 6 && (
              <div className="fixed top-96 w-[800px] left-1/2 transform -translate-x-1/2 text-center p-4">
                <div className="rounded-3xl bg-[#8CAD1E] text-white bg-opacity-70 hover:bg-opacity-100 p-4">
                  <p className="text-lg font-semibold mb-4">
                    {getStepMessage()}
                  </p>
                  <div className="flex justify-between">
                    <button
                      className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-[#8CAD1E] hover:text-white transition duration-300"
                      onClick={handlePreviousStep}
                    >
                      이전
                    </button>
                    <button
                      className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-[#8CAD1E] hover:text-white transition duration-300"
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

        <div className={`fixed ${step === 1 || step === -1 || step === 6 ? 'bottom-36' : 'bottom-42 right-20'}`}>
          <ThreeModel mousePosition={mousePosition} />
        </div>
      </div>
    </TeacherLayout>
  );
}
