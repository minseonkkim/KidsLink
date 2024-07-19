import BusChild from "../../components/teacher/bus/BusChild";
import NavigateBack from "../../components/teacher/common/NavigateBack";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import Title from "../../components/teacher/common/Title";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdNavigateBefore } from "react-icons/md";
import { MdNavigateNext } from "react-icons/md";
import { useState, useRef, useEffect } from 'react';

export default function TeacherBus() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('등원');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleClickOutside = (event:any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
    <TeacherHeader/>
    <div className="font-KoPubDotum px-[150px]">
          <NavigateBack backPage="홈" backLink='/'/>
          <Title title="등하원관리"/>
          <div className="absolute top-[180px] left-[150px] rounded-[10px] border-[1px] border-[#7C7C7C] w-[86px]">          
            <button className="text-[18px] flex flex-row items-center justify-center p-2" onClick={toggleDropdown}>
              <IoMdArrowDropdown className="text-[18px] mr-2"/>{selectedOption}
            </button>
            {isOpen && (
              <div
                className="absolute left-0 mt-1 w-[86px] rounded-[10px] border-[1px] border-[#7C7C7C] bg-white"
              >
                <div className="py-1" role="none">
                  <a href="#" className="text-[18px] block px-4 py-2 text-sm text-center text-gray-700" role="menuitem" onClick={() => handleOptionClick('등원')}>등원</a>
                  <a href="#" className="text-[18px] block px-4 py-2 text-sm text-center text-gray-700" role="menuitem" onClick={() => handleOptionClick('하원')}>하원</a>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="w-[210px] h-[330px] bg-[#F4F8ED] rounded-[20px] flex items-center justify-center font-bold text-[24px]">시립 도서관 앞</div>
            <MdNavigateBefore className="text-[50px] text-[#8CAD1E]"/>
            <div className="bg-[#D5E4B4] rounded-[20px] w-[420px] h-[510px] p-[20px] m-4">
              <p className="font-bold text-[24px] text-center mb-3">행복아파트 1단지 후문</p>
              
              <div className="bg-[#fff] rounded-[10px] w-[380px] h-[420px] m-1 p-3">
                <div className="flex flex-row">
                  <div className="flex items-center justify-center font-bold w-[310px]">탑승자</div>
                  <div className="flex items-center justify-center font-bold w-[60px]">탑승여부</div>
                </div>
                
                <BusChild/>
                <BusChild/>
              </div>
            </div>
            <MdNavigateNext className="text-[50px] text-[#8CAD1E]"/>
            <div className="w-[210px] h-[330px] bg-[#F4F8ED] rounded-[20px] flex items-center justify-center font-bold text-[24px]">햇살 마을 정문</div>
          </div>
          
    </div>
    </>
  )
}