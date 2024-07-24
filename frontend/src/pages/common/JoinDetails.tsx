import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import JoinHeader from "../../components/join/JoinHeader";
import ParentFormStep1 from "../../components/join/ParentFormStep1";
import ParentFormStep2 from "../../components/join/ParentFormStep2";
import ParentFormStep3 from "../../components/join/ParentFormStep3";
import TeacherFormStep1 from "../../components/join/TeacherFormStep1";
import TeacherFormStep2 from "../../components/join/TeacherFormStep2";
import TeacherFormStep3 from "../../components/join/TeacherFormStep3";

export default function JoinDetails() {
  const { role } = useParams<{ role: string }>(); // URL에서 role 파라미터 추출
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1); // 기본 단계는 1로 설정

  const handleNextStep = () => setStep((prevStep) => prevStep + 1);
  const handlePrevStep = () => setStep((prevStep) => prevStep - 1);
  const handleComplete = () => navigate("/");

  let FormComponent;

  if (role === "parent") {
    if (step === 1) {
      FormComponent = <ParentFormStep1 onNext={handleNextStep} />;
    } else if (step === 2) {
      FormComponent = <ParentFormStep2 onNext={handleNextStep} onBack={handlePrevStep} />;
    } else if (step === 3) {
      FormComponent = <ParentFormStep3 onComplete={handleComplete} onBack={handlePrevStep} />;
    } else {
      return <p>잘못된 단계입니다.</p>;
    }
  } else if (role === "teacher") {
    if (step === 1) {
      FormComponent = <TeacherFormStep1 onNext={handleNextStep} />;
    } else if (step === 2) {
      FormComponent = <TeacherFormStep2 onNext={handleNextStep} onBack={handlePrevStep} />;
    } else if (step === 3) {
      FormComponent = <TeacherFormStep3 onComplete={handleComplete} onBack={handlePrevStep} />;
    } else {
      return <p>잘못된 단계입니다.</p>;
    }
  } else if (role === "director") {
    // 여기에 원장님 관련 로직을 추가
    return <p>원장님 관련 단계는 아직 구현되지 않았습니다.</p>;
  } else {
    return <p>잘못된 역할입니다.</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <JoinHeader />
      <div className="w-full max-w-xl mx-auto mt-24 p-4">
        <p className="text-2xl font-bold mx-6">회원가입</p>
        <div className="border-b-2 border-black my-3 mx-6"></div>
        {FormComponent}
      </div>
    </div>
  );
}
