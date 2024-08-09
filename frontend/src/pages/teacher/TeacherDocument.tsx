import { useState, useEffect, useRef } from 'react';
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
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [displayedDocuments, setDisplayedDocuments] = useState([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState("전체");
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
  const [childImages, setChildImages] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver>();
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const fetchedDocuments = await getClassAllDocuments();

        const reversedDocuments = fetchedDocuments.reverse();
        setDocuments(reversedDocuments);
        setFilteredDocuments(reversedDocuments);

        if (reversedDocuments.length > 0) {
          const lastDocument = reversedDocuments[0];
          setSelectedDocumentType("전체");

          if (lastDocument.type === "Absent") {
            setSelectedDocumentId(lastDocument.details.absentId);
          } else {
            setSelectedDocumentId(lastDocument.details.dosageId);
          }
        }

        const images = {};
        for (const document of reversedDocuments) {
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
    let filtered = documents;

    if (selectedDocumentType && selectedDocumentType !== "전체") {
      filtered = documents.filter(document => document.type === selectedDocumentType);
    }

    if (searchTerm) {
      filtered = filtered.filter(document =>
        document.details.childName.includes(searchTerm)
      );
    }

    setFilteredDocuments(filtered);
    setDisplayedDocuments([]); // 필터가 변경될 때 표시된 문서 목록을 초기화합니다.
  }, [searchTerm, documents, selectedDocumentType]);

  useEffect(() => {
    const loadMoreDocuments = () => {
      setLoading(true);
      const newDocuments = filteredDocuments.slice(displayedDocuments.length, displayedDocuments.length + itemsPerPage);
      setDisplayedDocuments(prevDocs => [...prevDocs, ...newDocuments]);
      setLoading(false);
    };

    const observerCallback = (entries) => {
      if (entries[0].isIntersecting && !loading) {
        loadMoreDocuments();
      }
    };

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(observerCallback);
    if (observer.current && document.getElementById('load-more-trigger')) {
      observer.current.observe(document.getElementById('load-more-trigger'));
    }

    loadMoreDocuments();
  }, [filteredDocuments]);

  const handleDocumentClick = (type, id) => {
    setSelectedDocumentId(id);
    setSelectedDocumentType(type);
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
    const fetchedDocuments = await getClassAllDocuments();
    const reversedDocuments = fetchedDocuments.reverse();
    setDocuments(reversedDocuments);
    // 여기서 필터링 및 상태 초기화를 다시 처리하지 않고 상태를 유지
  };

  const handleFilterClick = (type) => {
    setSelectedDocumentType(type);
    setDisplayedDocuments([]); // 필터가 변경될 때 표시된 문서 목록을 초기화합니다.
  };

  return (
    <>
      <TeacherHeader />
      <div className="mt-[120px] lg:px-[150px] px-[20px]">
        <NavigateBack backPage="홈" backLink='/' />
        <Title title="문서관리" />
        <div className="flex flex-col lg:flex-row justify-between">
          <div className="rounded-[20px] bg-[#f4f4f4] lg:w-[380px] w-full lg:h-[520px] h-[320px] p-[10px] mb-3 lg:mb-0">
            <div className="flex space-x-2 ml-2 my-4">
            <button
              className={`rounded-[10px] ${selectedDocumentType === "전체" ? 'bg-[#D9D9D9] border-[2px] border-[#A0A0A0]' : 'bg-[#f4f4f4] border-[2px] border-[#d3d3d3]'} flex items-center justify-center w-[55px] h-[30px] font-bold text-[15px] cursor-pointer`}
              onClick={() => handleFilterClick("전체")}
            >
              전체
            </button>
              <button
                className={`rounded-[10px] ${selectedDocumentType === "Absent" ? 'bg-[#FFDFDF] border-[2px] border-[#FF5A5A]' : 'bg-[#f4f4f4] border-[2px] border-[#d3d3d3]'} flex items-center justify-center w-[55px] h-[30px] font-bold text-[15px] cursor-pointer`}
                onClick={() => handleFilterClick("Absent")}
              >
                결석
              </button>
              <button
                className={`rounded-[10px] ${selectedDocumentType === "Dosage" ? 'bg-[#E7DFFF] border-[2px] border-[#A085FF]' : 'bg-[#f4f4f4] border-[2px] border-[#d3d3d3]'} flex items-center justify-center w-[55px] h-[30px] font-bold text-[15px] cursor-pointer`}
                onClick={() => handleFilterClick("Dosage")}
              >
                투약
              </button>
            </div>

            <div className="bg-[#fff] lg:h-[53px] h-[46px] rounded-[10px] flex items-center p-3 mx-2 my-3">
              <IoSearch className="text-[25px] mr-3" />
              <input
                type="text"
                className="focus:outline-none text-[18px] w-full"
                placeholder="이름으로 검색하세요"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="bg-[#f4f4f4] lg:w-[360px] w-full lg:h-[355px] h-[230px] overflow-y-auto custom-scrollbar">
              {displayedDocuments.map((document, index) => (
                <div
                  key={index}
                  className={`${document.type === "Absent"
                    ? (document.details.absentId === selectedDocumentId && document.type === selectedDocumentType ? 'border-[3px]' : 'border-none')
                    : (document.details.dosageId === selectedDocumentId && document.type === selectedDocumentType ? 'border-[3px]' : 'border-none')}
                  m-[10px] mb-[15px] w-full lg:w-[320px] lg:h-[100px] h-[80px] rounded-[15px] border-[#B2D170] cursor-pointer`}
                  onClick={() => handleDocumentClick(document.type, document.type === "Absent" ? document.details.absentId : document.details.dosageId)}
                >
                  <DocumentChild
                    type={document.type}
                    name={document.details.childName}
                    profileImgPath={childImages[document.details.childId] || ''}
                    finish={document.details.confirmationStatus}
                  />
                </div>
              ))}
              <div id="load-more-trigger" className="h-2"></div>
              {loading && <p>Loading more documents...</p>}
            </div>
          </div>
          <div className='border-[#B2D170] border-[3px] rounded-[20px] lg:w-[calc(100%-400px)] w-full'>
            {selectedDocumentType === "Absent" ? 
            (selectedDocumentId !== null && <AbsentDocument absentId={selectedDocumentId} onUpdate={handleDocumentUpdate} isOurClass={false} />) : 
            (selectedDocumentId !== null && <DosageDocument dosageId={selectedDocumentId} onUpdate={handleDocumentUpdate} isOurClass={false}/>)
          }

          </div>
        </div>
      </div>
    </>
  );
}
