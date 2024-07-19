import TeacherHeader from '../../components/teacher/common/TeacherHeader';
import ProfileImg from '../../assets/teacher/profile_img.jpg';
import Title from '../../components/teacher/common/Title';
import NavigateBack from '../../components/teacher/common/NavigateBack';
import DosageDocument from '../../components/teacher/document/DosageDocument';
import AbsentDocument from '../../components/teacher/document/AbsentDocument';
import DocumentChild from '../../components/teacher/document/DocumentChild';

export default function TeacherDocument(){
  return (
    <>
      <TeacherHeader/>
      <div className="font-KoPubDotum px-[150px]">
        <NavigateBack backPage="홈" backLink='/'/>
        <Title title="문서관리"/>
        <div className="flex flex-row justify-between">
          <div className="rounded-[20px] bg-[#f4f4f4] w-[380px] h-[520px] p-[10px]">
            <div className="rounded-[20px] bg-[#f4f4f4] w-[370px] h-[500px] overflow-y-auto custom-scrollbar">
              <DocumentChild currentChild={true} type="투약" name="김민선" profileImgPath={ProfileImg} finish={true}/>
              <DocumentChild currentChild={false} type="결석" name="김범수" profileImgPath={ProfileImg} finish={false}/>
              <DocumentChild currentChild={false} type="투약" name="김민선" profileImgPath={ProfileImg} finish={false}/>
              <DocumentChild currentChild={false} type="결석" name="김지원" profileImgPath={ProfileImg} finish={true}/>
              <DocumentChild currentChild={false} type="결석" name="김민선" profileImgPath={ProfileImg} finish={true}/>
              <DocumentChild currentChild={false} type="투약" name="김민선" profileImgPath={ProfileImg} finish={false}/>
            </div>
          </div>
          <DosageDocument/>
          {/* <AbsentDocument/> */}
        </div>
      </div>
      
    </>
  )
}