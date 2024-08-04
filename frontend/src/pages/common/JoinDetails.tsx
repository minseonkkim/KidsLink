import { useState } from "react"
import { useParams } from "react-router-dom"
import JoinHeader from "../../components/join/JoinHeader"
import ParentFormStep1 from "../../components/join/form/ParentFormStep1"
import ParentFormStep2 from "../../components/join/form/ParentFormStep2"
import ParentFormStep3 from "../../components/join/form/ParentFormStep3"
import TeacherFormStep1 from "../../components/join/form/TeacherFormStep1"
import TeacherFormStep2 from "../../components/join/form/TeacherFormStep2"
import TeacherFormStep3 from "../../components/join/form/TeacherFormStep3"

export default function JoinDetails() {
  const { role } = useParams<{ role: string }>();
  const [step, setStep] = useState<number>(1);

  const handleNextStep = () => setStep((prevStep) => prevStep + 1);
  const handlePrevStep = () => setStep((prevStep) => prevStep - 1);

  let FormComponent: JSX.Element | null = null;

  if (role === "parent") {
    if (step === 1) {
      FormComponent = <ParentFormStep1 onNext={handleNextStep} />;
    } else if (step === 2) {
      FormComponent = (
        <ParentFormStep2 onNext={handleNextStep} onBack={handlePrevStep} />
      );
    } else if (step === 3) {
      FormComponent = <ParentFormStep3 />;
    } else {
      FormComponent = <p>잘못된 단계입니다.</p>;
    }
  } else if (role === "teacher") {
    if (step === 1) {
      FormComponent = <TeacherFormStep1 onNext={handleNextStep} />;
    } else if (step === 2) {
      FormComponent = (
        <TeacherFormStep2 onNext={handleNextStep} onBack={handlePrevStep} />
      );
    } else if (step === 3) {
      FormComponent = <TeacherFormStep3 />;
    } else {
      FormComponent = <p>잘못된 단계입니다.</p>;
    }
  } else if (role === "director") {
    FormComponent = <p>원장님 회원가입은 아직 구현되지 않았습니다.</p>;
  } else {
    FormComponent = <p>잘못된 역할입니다.</p>;
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
  )
}
