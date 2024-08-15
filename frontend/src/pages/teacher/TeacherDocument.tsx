import { useState, useEffect, useRef } from 'react';
import TeacherLayout from '../../layouts/TeacherLayout';
import Title from '../../components/teacher/common/Title';
import { IoSearch } from "react-icons/io5";
import DosageDocument from '../../components/teacher/document/DosageDocument';
import DocumentChild from '../../components/teacher/document/DocumentChild';
import { getClassAllDocuments } from '../../api/document';
import { getChildInfo } from '../../api/child';
import AbsentDocument from '../../components/teacher/document/AbsentDocument';
import daramgi from "../../assets/teacher/document-daramgi.png";
import { AxiosError } from 'axios';

export default function TeacherDocument() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]); 
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("전체"); 
  const [selectedDocumentKey, setSelectedDocumentKey] = useState<string | null>(null);
  const [selectedDocumentRealType, setSelectedDocumentRealType] = useState<string | null>(null);
  const [childImages, setChildImages] = useState<{ [key: number]: string }>({}); 
  const [loading, setLoading] = useState(false); 

  const documentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = !!localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!isLoggedIn) return;

      try {
        const fetchedDocuments = await getClassAllDocuments();
        const reversedDocuments = fetchedDocuments.reverse();
        setDocuments(reversedDocuments);
        filterAndSetDocuments(reversedDocuments, "전체");

        if (reversedDocuments.length > 0) {
          const lastDocument = reversedDocuments[0];
          selectDocument(lastDocument);
        }

        const images = {};
        for (const document of reversedDocuments) {
          const profileImgPath = await findChildImg(document.details.childId);
          images[document.details.childId] = profileImgPath;
        }
        setChildImages(images);
      } catch (error) {
        handleError(error);
      }
    };

    if (isLoggedIn) {
      fetchDocuments();
    }
  }, [isLoggedIn]);

  const filterAndSetDocuments = (docs, type) => {
    let filtered = docs;
    if (type !== "전체") {
      filtered = docs.filter(document => document.type === type);
    }
    if (searchTerm) {
      filtered = filtered.filter(document =>
        document.details.childName.includes(searchTerm)
      );
    }
    setFilteredDocuments(filtered);
  };

  useEffect(() => {
    filterAndSetDocuments(documents, selectedDocument.type || "전체");
  }, [searchTerm, documents, selectedDocument.type]);

  const handleDocumentClick = (type, id) => {
    const documentKey = `${type}-${id}`; // 문서 타입과 ID를 결합하여 고유한 키 생성
    setSelectedDocumentKey(documentKey);
    setSelectedDocumentRealType(type);
  };

  const findChildImg = async (childId: number): Promise<string> => {
    if (childImages[childId]) {
      return childImages[childId];
    }

    const childInfo = await getChildInfo(childId);
    const profileImgPath = childInfo.profile;

    setChildImages(prevImages => ({
      ...prevImages,
      [childId]: profileImgPath
    }));

    return profileImgPath;
  };

  const handleDocumentUpdate = async () => {
    if (!isLoggedIn) return;
    const fetchedDocuments = await getClassAllDocuments();
    const reversedDocuments = fetchedDocuments.reverse();
    setDocuments(reversedDocuments);
    filterAndSetDocuments(reversedDocuments, selectedDocument.type || "전체");
  };

  const handleFilterClick = (type) => {
    setSelectedDocumentType(type);

    const filteredDocs = documents.filter(document => type === "전체" || document.type === type);

    if (filteredDocs.length > 0) {
      selectDocument(filteredDocs[0]);
    } else {
      resetSelection();
    }

    filterAndSetDocuments(documents, type);

    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const selectDocument = (document) => {
    const documentKey = `${document.type}-${document.type === "Absent" ? document.details.absentId : document.details.dosageId}`;
    setSelectedDocumentKey(documentKey);
    setSelectedDocumentRealType(document.type);
  };

  const resetSelection = () => {
    setSelectedDocumentKey(null);
    setSelectedDocumentRealType(null);
  };

  const handleError = (error) => {
    if ((error as AxiosError).response && (error as AxiosError).response.status === 401) {
      console.error("Unauthorized request. User might be logged out.");
    } else {
      console.error('Failed to fetch documents:', error);
    }
  };

  return (
    <TeacherLayout
      activeMenu="document"
      setActiveMenu={() => {}}
      titleComponent={<Title title="서류관리" />}
      imageSrc={daramgi} 
    >
      <div className="relative w-full lg:my-12 mt-5 px-[15px] flex flex-col lg:flex-row justify-between">
        {/* 필터 및 검색 영역 */}
        <div className="rounded-[20px] bg-[#f4f4f4] w-full lg:w-[360px] lg:h-[540px] h-[340px] p-[15px] mb-5 lg:mb-0">
          <div className="flex space-x-2 ml-2 mb-4">
            {["전체", "Absent", "Dosage"].map(type => (
              <button
                key={type}
                className={`rounded-[10px] ${selectedDocumentType === type ? 

                  (type === "Absent" ? 'bg-[#FFDFDF] border-[2px] border-[#FF5A5A]' : type === "Dosage" ? 'bg-[#E7DFFF] border-[2px] border-[#A085FF]' : 'bg-[#D9D9D9] border-[2px] border-[#A0A0A0]')





                   : 'bg-[#f4f4f4] border-[2px] border-[#d3d3d3]'} flex items-center justify-center w-[60px] h-[35px] font-bold text-[15px] cursor-pointer`}
                onClick={() => handleFilterClick(type)}
              >
                {type === "전체" ? "전체" : type === "Absent" ? "결석" : "투약"}
              </button>
            ))}
          </div>

          {/* 검색 창 */}
          <div className="bg-[#fff] h-[46px] lg:h-[53px] rounded-[10px] flex items-center p-3 mx-2 my-3">
            <IoSearch className="text-[25px] mr-3" />
            <input
              type="text"
              className="focus:outline-none text-[18px] w-full"
              placeholder="이름으로 검색하세요"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* 문서 목록 */}
          <div
            ref={containerRef}
            className="bg-[#f4f4f4] w-full lg:w-[340px] h-[200px] lg:h-[395px] overflow-y-auto custom-scrollbar"
          >
            {filteredDocuments.map((document, index) => {
              const documentKey = `${document.type}-${document.type === "Absent" ? document.details.absentId : document.details.dosageId}`;
              return (
                <div
                  key={index}
                  ref={el => (documentRefs.current[documentKey] = el)}
                  className={`lg:m-[10px] m-0 mb-[15px] lg:w-[295px] w-[255px] h-[80px] lg:h-[100px] rounded-[15px] border-[3px] ${
                    documentKey === selectedDocumentKey
                      ? 'border-[#B2D170]'
                      : 'border-none'
                  } cursor-pointer`}
                  onClick={() => handleDocumentClick(document.type, document.type === "Absent" ? document.details.absentId : document.details.dosageId)}
                >
                  <DocumentChild
                    type={document.type}
                    name={document.details.childName}
                    profileImgPath={childImages[document.details.childId] || ''}
                    finish={document.details.confirmationStatus}
                  />
                </div>
              );
            })}
            <div id="load-more-trigger" className="h-2"></div>
            {loading && <p>Loading more documents...</p>}
          </div>
        </div>

        {/* 문서 상세보기 영역 */}
        <div className='border-[#B2D170] border-[3px] rounded-[20px] w-full lg:w-[700px] h-[340px] lg:h-[550px] p-[15px] px-[7px]'>
          <div className='custom-scrollbar overflow-y-auto h-full w-full'>
            {selectedDocumentKey !== null && selectedDocumentRealType === "Absent" && (
              <AbsentDocument absentId={parseInt(selectedDocumentKey.split('-')[1])} onUpdate={handleDocumentUpdate} isOurClass={false} />
            )}
            {selectedDocumentKey !== null && selectedDocumentRealType === "Dosage" && (
              <DosageDocument dosageId={parseInt(selectedDocumentKey.split('-')[1])} onUpdate={handleDocumentUpdate} isOurClass={false} />
            )}
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
// filterAndSetDocuments(reversedDocuments, "전체")
