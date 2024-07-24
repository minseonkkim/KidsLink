import { useLocation } from "react-router-dom";
import JoinHeader from "../../components/join/JoinHeader";
import ParentFormStep1 from "../../components/join/ParentFormStep1";
import ParentFormStep2 from "../../components/join/ParentFormStep2";
import ParentFormStep3 from "../../components/join/ParentFormStep3";
import TeacherFormStep1 from "../../components/join/TeacherFormStep1";
import TeacherFormStep2 from "../../components/join/TeacherFormStep2";
import TeacherFormStep3 from "../../components/join/TeacherFormStep3";

export default function JoinDetails() {
  const location = useLocation();
  const { role, step } = location.state || {};

  if (!role) {
    return <p>역할 정보가 없습니다.</p>;
  }

  let FormComponent;

  if (role === "학부모") {
    if (step === 1) {
      FormComponent = ParentFormStep1;
    } else if (step === 2) {
      FormComponent = ParentFormStep2;
    } else if (step === 3) {
      FormComponent = ParentFormStep3;
    } else {
      return <p>잘못된 단계입니다.</p>;
    }
  } else if (role === "선생님") {
    if (step === 1) {
      FormComponent = TeacherFormStep1;
    } else if (step === 2) {
      FormComponent = TeacherFormStep2;
    } else if (step === 3) {
      FormComponent = TeacherFormStep3;
    } else {
      return <p>잘못된 단계입니다.</p>;
    }
  } else {
    return <p>잘못된 역할입니다.</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <JoinHeader />
      
      <div className="w-full max-w-xl mx-auto mt-24 p-4">
        <p className="text-2xl font-bold mx-6">회원가입</p>
        <div className="border-b-2 border-black my-3 mx-6"></div>

        <FormComponent />
      </div>
    </div>
  );
}
