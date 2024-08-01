import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InfoSection from "../../components/parent/common/InfoSection";
import daramgi from '../../assets/parent/document-daramgi.png';
import pill from '../../assets/parent/pill.png';
import absentIcon from '../../assets/parent/absent.png';
import checkedIcon from '../../assets/parent/check.png';
import handWithPen from '../../assets/parent/pen.png';
import { getKidAllDocuments, ParentDocumentData } from '../../api/document';
import { useParentInfoStore } from '../../stores/useParentInfoStore';

interface MappedDocument {
  id: number;
  date: string;
  type: 'dosage' | 'absent';
  checked: boolean;
  startDate: string;
  endDate: string;
  documentId: number;
  title: string;
  details: string;
  childId: number;
}

export default function ParentDocument() {
  const [documents, setDocuments] = useState<MappedDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [scroll, setScroll] = useState(false);
  const navigate = useNavigate();
  const divRef = useRef<HTMLDivElement>(null);

  const childId = useParentInfoStore((state) => state.parentInfo?.child.childId);

  useEffect(() => {
    async function fetchDocuments() {
      if (childId) {
        try {
          const response: ParentDocumentData[] = await getKidAllDocuments(childId);
          if (response) {
            const parsedDocuments = response.map((item: ParentDocumentData): MappedDocument => {
              console.log("item: ", item)
              if (item.dosage) {
                return {
                  id: item.id,
                  date: item.date,
                  type: 'dosage',
                  checked: item.dosage.confirmationStatus === "T",
                  startDate: item.dosage.startDate,
                  endDate: item.dosage.endDate,
                  documentId: item.dosage.dosageId,
                  title: item.dosage.name,
                  details: item.dosage.details,
                  childId:childId
                };
              } else if (item.absent) {
                return {
                  id: item.id,
                  date: item.date,
                  type: 'absent',
                  checked: item.absent.confirmationStatus === "T",
                  startDate: item.absent.startDate,
                  endDate: item.absent.endDate,
                  documentId: item.absent.absentId,
                  title: item.absent.reason,
                  details: item.absent.details,
                  childId:childId
                };
              } else {
                throw new Error("Document must have either dosage or absent data");
              }
            });
            setDocuments(parsedDocuments);
          }
        } catch (error) {
          console.error("Failed to fetch documents", error);
        }
      }
    }

    fetchDocuments();
  }, [childId]);

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
        setScroll(topPosition <= 200);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToSubmitPage = () => {
    navigate('/document/submit');
  };

  const navigateToDetailPage = (docType: string, docId: number) => {
    navigate(`/document/${docType}/${docId}`);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center bg-[#FFEC8A]">
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
                key={`${doc.type}-${doc.documentId}`}
                className={`flex flex-col p-4 rounded-2xl bg-[#FFF9D7] border-1 border-[#FFEC8A] hover:bg-[#ffec8a] transition-colors duration-200 cursor-pointer`}
                onClick={() => navigateToDetailPage(doc.type, doc.documentId)}
              >
                <div className="flex items-center">
                  <div>
                    <p className="text-base font-bold text-[#757575]">
                      {`${doc.startDate} ~ ${doc.endDate}`}
                    </p>
                    <div className="flex items-center"> 
                      <img
                        src={doc.type === 'dosage' ? pill : absentIcon}
                        alt={doc.type === 'dosage' ? 'pill' : 'absent'}
                        className="w-7 h-7 mr-4"
                      />
                      <p className="text-lg font-bold text-[#353c4e] pt-1">
                        {doc.title}
                      </p>
                    </div>
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