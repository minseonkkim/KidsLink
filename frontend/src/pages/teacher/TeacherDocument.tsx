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
  const [selectedDocumentType, setSelectedDocumentType] = useState("");
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
          setSelectedDocumentType(lastDocument.type);

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
    setFilteredDocuments(
      documents.filter(document =>
        document.details.childName.includes(searchTerm)
      )
    );
  }, [searchTerm, documents]);

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
    setFilteredDocuments(reversedDocuments);
    setDisplayedDocuments([]);
  };

  return (
    <>
      <TeacherHeader />
      <div className="mt-[120px] lg:px-[150px] px-[20px]">
        <NavigateBack backPage="홈" backLink='/' />
        <Title title="문서관리" />
        <div className="flex flex-col lg:flex-row justify-between">
          <div className="rounded-[20px] bg-[#f4f4f4] lg:w-[380px] w-full lg:h-[520px] h-[320px] p-[10px] mb-3 lg:mb-0">
            <div className="flex flex-wrap">
              {/* 결석 버튼 */}
              <button
                className={`m-[10px] mb-[15px] w-full lg:w-[320px] lg:h-[100px] h-[80px] rounded-[15px] border-[3px] border-[#B2D170] cursor-pointer`}
              >
                결석
              </button>

              {/* 투약 버튼 */}
              <button
                className={`m-[10px] mb-[15px] w-full lg:w-[320px] lg:h-[100px] h-[80px] rounded-[15px] border-[3px] border-[#B2D170] cursor-pointer`}
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
            <div className="bg-[#f4f4f4] lg:w-[360px] w-full lg:h-[420px] h-[230px] overflow-y-auto custom-scrollbar">
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
