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
  const [displayedDocuments, setDisplayedDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState<{ id: number | null; type: string | null }>({ id: null, type: null });
  const [childImages, setChildImages] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver>();
  const itemsPerPage = 10;

  const documentRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
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
          const documentId = lastDocument.type === "Absent" ? lastDocument.details.absentId : lastDocument.details.dosageId;
          setSelectedDocument({ id: documentId, type: lastDocument.type });
        }

        const images = {};
        for (const document of reversedDocuments) {
          const profileImgPath = await findChildImg(document.details.childId);
          images[document.details.childId] = profileImgPath;
        }
        setChildImages(images);
      } catch (error) {
        if ((error as AxiosError).response && (error as AxiosError).response.status === 401) {
          console.error("Unauthorized request. User might be logged out.");
        } else {
          console.error('Failed to fetch documents:', error);
        }
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
    setDisplayedDocuments(filtered.slice(0, itemsPerPage));
  };

  useEffect(() => {
    filterAndSetDocuments(documents, selectedDocument.type || "전체");
  }, [searchTerm, documents, selectedDocument.type]);

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
    setSelectedDocument({ id, type });
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
    setSelectedDocument({ id: null, type });
    const filteredDocs = documents.filter(document => type === "전체" || document.type === type);

    if (filteredDocs.length > 0) {
      const firstDocument = filteredDocs[0];
      const documentId = firstDocument.type === "Absent" ? firstDocument.details.absentId : firstDocument.details.dosageId;
      setSelectedDocument({ id: documentId, type: firstDocument.type });
    } else {
      setSelectedDocument({ id: null, type: null });
    }

    filterAndSetDocuments(documents, type);

    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
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
        <div className="rounded-[20px] bg-[#f4f4f4] w-full lg:w-[360px] lg:h-[540px] h-[340px] p-[15px] mb-5 lg:mb-0">
          <div className="flex space-x-2 ml-2 mb-4">
            <button
              className={`rounded-[10px] ${selectedDocument.type === "전체" ? 'bg-[#D9D9D9] border-[2px] border-[#A0A0A0]' : 'bg-[#f4f4f4] border-[2px] border-[#d3d3d3]'} flex items-center justify-center w-[60px] h-[35px] font-bold text-[15px] cursor-pointer`}
              onClick={() => handleFilterClick("전체")}
            >
              전체
            </button>
            <button
              className={`rounded-[10px] ${selectedDocument.type === "Absent" ? 'bg-[#FFDFDF] border-[2px] border-[#FF5A5A]' : 'bg-[#f4f4f4] border-[2px] border-[#d3d3d3]'} flex items-center justify-center w-[60px] h-[35px] font-bold text-[15px] cursor-pointer`}
              onClick={() => handleFilterClick("Absent")}
            >
              결석
            </button>
            <button
              className={`rounded-[10px] ${selectedDocument.type === "Dosage" ? 'bg-[#E7DFFF] border-[2px] border-[#A085FF]' : 'bg-[#f4f4f4] border-[2px] border-[#d3d3d3]'} flex items-center justify-center w-[60px] h-[35px] font-bold text-[15px] cursor-pointer`}
              onClick={() => handleFilterClick("Dosage")}
            >
              투약
            </button>
          </div>

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
          <div
            ref={containerRef}
            className="bg-[#f4f4f4] w-full lg:w-[340px] h-[200px] lg:h-[395px] overflow-y-auto custom-scrollbar"
          >
            {displayedDocuments.map((document, index) => (
              <div
                key={index}
                ref={el => (documentRefs.current[document.details.absentId || document.details.dosageId] = el)}
                className={`lg:m-[10px] m-0 mb-[15px] lg:w-[295px] w-[255px] h-[80px] lg:h-[100px] rounded-[15px] border-[3px] ${
                  (document.details.absentId === selectedDocument.id && document.type === selectedDocument.type) ||
                  (document.details.dosageId === selectedDocument.id && document.type === selectedDocument.type)
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
            ))}
            <div id="load-more-trigger" className="h-2"></div>
            {loading && <p>Loading more documents...</p>}
          </div>
        </div>
        <div className='border-[#B2D170] border-[3px] rounded-[20px] w-full lg:w-[700px] h-[340px] lg:h-[550px] p-[15px] px-[7px]'>
          <div className='custom-scrollbar overflow-y-auto h-full w-full'>
            {selectedDocument.id !== null && selectedDocument.type === "Absent" && (
              <AbsentDocument absentId={selectedDocument.id} onUpdate={handleDocumentUpdate} isOurClass={false} />
            )}
            {selectedDocument.id !== null && selectedDocument.type === "Dosage" && (
              <DosageDocument dosageId={selectedDocument.id} onUpdate={handleDocumentUpdate} isOurClass={false} />
            )}
          </div>
          
        </div>
      </div>
    </TeacherLayout>
  );
}
