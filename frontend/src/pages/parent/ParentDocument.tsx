import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommonHeader from '../../components/parent/common/CommonHeader';
import InfoSection from "../../components/parent/common/InfoSection";
import daramgi from '../../assets/parent/document-daramgi.png';
import pill from '../../assets/parent/pill.png';
import absentIcon from '../../assets/parent/absent.png';
import checkedIcon from '../../assets/parent/check.png';
import handWithPen from '../../assets/parent/pen.png';

const documents = [
  {
    id: 1,
    date: '2024.07.13 - 2024.07.25',
    title: '감기약',
    type: 'med',
    checked: false,
  },
  {
    id: 2,
    date: '2024.07.13 - 2024.07.25',
    title: '불국사 견학',
    type: 'absent',
    checked: true,
  },
];

export default function ParentDocument() {
  const [searchTerm, setSearchTerm] = useState('');
  const [scroll, setScroll] = useState(false);
  const navigate = useNavigate();
  const divRef = useRef<HTMLDivElement>(null);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleScroll = () => {
      if (divRef.current) {
        const topPosition = divRef.current.getBoundingClientRect().top;
        if (topPosition <= 200) {
          setScroll(true);
        } else {
          setScroll(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToSubmitPage = () => {
    navigate('/document/submit');
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center bg-[#FFEC8A]">
      <CommonHeader title="서류" />

      <div className="w-full flex flex-col items-center mt-16 flex-grow">
        <InfoSection
          main1="아이의 소식"
          main2="을"
          description2="전달해 주세요!"
          imageSrc={daramgi}
          altText="다람쥐"
        />
        
        <div
          ref={divRef}
          className="w-full bg-white rounded-tl-[20px] rounded-tr-[20px] px-12 shadow-top flex-grow overflow-hidden animate-slideUp"
          style={{ marginTop: '-40px' }}
        >
          <div className="flex items-center justify-between">
            <input
              type="text"
              placeholder="🔍︎"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-2 my-6 border-b-2 border-gray-300 focus:outline-none focus:border-[#FDDA6E]"
            />
          </div>
          <div className={`space-y-6 ${scroll ? 'overflow-y-auto' : 'overflow-hidden'}`} style={{ maxHeight: scroll ? 'calc(100vh - 200px)' : 'auto', paddingBottom: '100px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className={`flex flex-col p-4 rounded-2xl bg-[#FFF9D7] border-1 border-[#FFEC8A] hover:bg-[#ffec8a] transition-colors duration-200`}
              >
                <div className="flex items-center">
                  <img
                    src={doc.type === 'med' ? pill : absentIcon}
                    alt={doc.type === 'med' ? 'pill' : 'absent'}
                    className="w-[30px] h-[30px] mr-4"
                  />
                  <div>
                    <p className="text-base font-bold text-[#757575]">
                      {doc.date}
                    </p>
                    <p className="text-lg font-bold text-[#353c4e]">
                      {doc.title}
                    </p>
                  </div>
                  {doc.checked && (
                    <img
                      src={checkedIcon}
                      alt="checked"
                      className="w-[30px] h-[30px] ml-auto object-contain"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className="fixed right-10 z-40 bottom-20 md:bottom-16"
        onClick={navigateToSubmitPage}
      >
        <div
          className="z-50 w-[70px] h-[70px] rounded-full bg-[#ffec8a] flex items-center justify-center"
          style={{
            boxShadow:
              '0px 13px 27px -5px rgba(50,50,93,0.25), 0px 8px 16px -8px rgba(0,0,0,0.3)',
          }}
        >
          <img
            src={handWithPen}
            alt="hand with pen"
            className="w-[35px] h-[35px] object-contain"
          />
        </div>
      </div>
    </div>
  );
}
