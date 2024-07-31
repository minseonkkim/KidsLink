import { useState, useEffect } from 'react';
import TeacherHeader from '../../components/teacher/common/TeacherHeader';
import Title from '../../components/teacher/common/Title';
import NavigateBack from '../../components/teacher/common/NavigateBack';
import { IoSearch } from "react-icons/io5";
import DosageDocument from '../../components/teacher/document/DosageDocument';
import DocumentChild from '../../components/teacher/document/DocumentChild';
import { getClassAllDocuments } from '../../api/document';
import { getChildInfo } from '../../api/child';
import AbsentDocument from '../../components/teacher/document/AbsentDocument';

export default function TeacherDocument() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState("");
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
  const [childImages, setChildImages] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const fetchedDocuments = await getClassAllDocuments();
        console.log(fetchedDocuments);

        setDocuments(fetchedDocuments);
        if (fetchedDocuments.length > 0) {
          setSelectedDocumentType(fetchedDocuments[0].type);
          if (fetchedDocuments[0].type === "Absent") {
            setSelectedDocumentId(fetchedDocuments[0].details.absentId);
          } else {
            setSelectedDocumentId(fetchedDocuments[0].details.dosageId);
          }
        }

        // Fetch and store child images
        const images = {};
        for (const document of fetchedDocuments) {
          const profileImgPath = await findChildImg(document.details.childId);
          images[document.details.childId] = profileImgPath;
        }
        setChildImages(images);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
      }
    };

    fetchDocuments();
  }, []);

  useEffect(() => {
    setFilteredDocuments(
      documents.filter(document =>
        document.details.childName.includes(searchTerm)
      )
    );
  }, [searchTerm, documents]);

  const handleDocumentClick = (type, id) => {
    setSelectedDocumentId(id);
    setSelectedDocumentType(type);
  };

  const findChildImg = async (childId: number): Promise<string> => {
    const childInfo = await getChildInfo(childId);
    return childInfo.profile;
  };

  return (
    <>
      <TeacherHeader />
      <div className="mt-[120px] px-[150px]">
        <NavigateBack backPage="홈" backLink='/' />
        <Title title="문서관리" />
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
                <div
                  key={index}
                  className={`${document.type === "Absent"
                    ? (document.details.absentId === selectedDocumentId && document.type === selectedDocumentType ? 'border-[3px]' : 'border-none')
                    : (document.details.dosageId === selectedDocumentId && document.type === selectedDocumentType ? 'border-[3px]' : 'border-none')}
                  m-[10px] mb-[15px] w-[320px] h-[100px] rounded-[15px] border-[#B2D170] cursor-pointer`}
                  onClick={() => handleDocumentClick(document.type, document.type === "Absent" ? document.details.absentId : document.details.dosageId)}
                >
                  <DocumentChild
                    type={document.type}
                    name={document.details.childName}
                    profileImgPath={childImages[document.details.childId] || ''}
                  />
                </div>
              ))}
            </div>
          </div>
          {selectedDocumentType === "Absent" ? 
            (selectedDocumentId !== null && <AbsentDocument absentId={selectedDocumentId} />) : 
            (selectedDocumentId !== null && <DosageDocument dosageId={selectedDocumentId}/>)
          }
        </div>
      </div>
    </>
  );
}