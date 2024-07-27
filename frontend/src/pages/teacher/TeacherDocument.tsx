import { useState, useEffect } from 'react';
import TeacherHeader from '../../components/teacher/common/TeacherHeader';
import ProfileImg from '../../assets/teacher/profile_img.jpg';
import Title from '../../components/teacher/common/Title';
import NavigateBack from '../../components/teacher/common/NavigateBack';
import { IoSearch } from "react-icons/io5";
import DosageDocument from '../../components/teacher/document/DosageDocument';
import DocumentChild from '../../components/teacher/document/DocumentChild';

interface Document {
  currentChild: boolean;
  type: string;
  name: string;
  profileImgPath: string;
  finish: boolean;
}

export default function TeacherDocument(){
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);

  const documents: Document[] = [
    { currentChild: true, type: "투약", name: "김민선", profileImgPath: ProfileImg, finish: true },
    { currentChild: false, type: "결석", name: "김범수", profileImgPath: ProfileImg, finish: false },
    { currentChild: false, type: "투약", name: "김민선", profileImgPath: ProfileImg, finish: false },
    { currentChild: false, type: "결석", name: "김지원", profileImgPath: ProfileImg, finish: true },
    { currentChild: false, type: "결석", name: "김민선", profileImgPath: ProfileImg, finish: true },
    { currentChild: false, type: "투약", name: "김민선", profileImgPath: ProfileImg, finish: false },
  ];

  useEffect(() => {
    setFilteredDocuments(
      documents.filter(document =>
        document.name.includes(searchTerm)
      )
    );
  }, [searchTerm]);

  return (
    <>
      <TeacherHeader/>
      <div className="mt-[120px] px-[150px]">
        <NavigateBack backPage="홈" backLink='/'/>
        <Title title="문서관리"/>
        <div className="flex flex-row justify-between">
          <div className="rounded-[20px] bg-[#f4f4f4] w-[380px] h-[520px] p-[10px]">
            <div className="bg-[#fff] h-[53px] rounded-[10px] flex items-center p-3 mx-2 my-3">
              <IoSearch className="text-[25px] mr-3" />
              <input
                type="text"
                className="focus:outline-none text-[18px] w-full"
                placeholder="이름으로 검색하세요"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="rounded-[20px] bg-[#f4f4f4] w-[360px] h-[420px] overflow-y-auto custom-scrollbar">
              {filteredDocuments.map((document, index) => (
                <DocumentChild
                  key={index}
                  currentChild={document.currentChild}
                  type={document.type}
                  name={document.name}
                  profileImgPath={document.profileImgPath}
                  finish={document.finish}
                />
              ))}
            </div>
          </div>
          <DosageDocument/>
          {/* <AbsentDocument/> */}
        </div>
      </div>
      
    </>
  );
}
