import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InfoSection from "../../components/parent/common/InfoSection";
import SearchTitleBar from "../../components/parent/common/SearchTitleBar";
import DocumentList from "../../components/parent/document/DocumentList";
import daramgi from "../../assets/parent/document-daramgi.png";
import handWithPen from "../../assets/parent/pen.png";
import { getKidAllDocuments } from "../../api/document";
import { ParentDocumentData } from "../../types/document";
import { useParentInfoStore } from "../../stores/useParentInfoStore";
import { getParentInfo } from "../../api/Info";
import { formatDate } from "../../utils/parent/dateUtils";

interface MappedDocument {
  id: number;
  date: string;
  type: "dosage" | "absent";
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
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const parentInfo = useParentInfoStore((state) => state.parentInfo);
  const setParentInfo = useParentInfoStore((state) => state.setParentInfo);
  const childId = parentInfo?.child.childId;

  useEffect(() => {
    async function fetchParentInfoAndDocuments() {
      try {
        let currentChildId = childId;
        if (!currentChildId) {
          const fetchedParentInfo = await getParentInfo();
          setParentInfo(fetchedParentInfo);
          currentChildId = fetchedParentInfo.child.childId;
        }

        if (currentChildId) {
          const response: ParentDocumentData[] = await getKidAllDocuments(
            currentChildId
          );
          if (response) {
            const parsedDocuments = response.map(
              (item: ParentDocumentData): MappedDocument => {
                if (item.dosage) {
                  return {
                    id: item.id,
                    date: formatDate(item.date),
                    type: "dosage",
                    checked: item.dosage.confirmationStatus === "T",
                    startDate: formatDate(item.dosage.startDate),
                    endDate: formatDate(item.dosage.endDate),
                    documentId: item.dosage.dosageId,
                    title: item.dosage.name,
                    details: item.dosage.details,
                    childId: currentChildId,
                  };
                } else if (item.absent) {
                  return {
                    id: item.id,
                    date: formatDate(item.date),
                    type: "absent",
                    checked: item.absent.confirmationStatus === "T",
                    startDate: formatDate(item.absent.startDate),
                    endDate: formatDate(item.absent.endDate),
                    documentId: item.absent.absentId,
                    title: item.absent.reason,
                    details: item.absent.details,
                    childId: currentChildId,
                  };
                } else {
                  throw new Error(
                    "Document must have either dosage or absent data"
                  );
                }
              }
            );
            setDocuments(parsedDocuments.reverse());
          }
        }
      } catch (error) {
        console.error("Failed to fetch documents", error);
      }
    }
    fetchParentInfoAndDocuments();
  }, [childId, setParentInfo]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigateToSubmitPage = () => {
    navigate("/document/submit");
  };

  const navigateToDetailPage = (docType: string, docId: number) => {
    navigate(`/document/${docType}/${docId}`);
  };

  return (
    <div className="flex flex-col h-screen bg-[#FFEC8A]">
      <InfoSection
        main1="아이의 소식"
        main2="을"
        description2="전달해 주세요!"
        imageSrc={daramgi}
        altText="다람쥐"
      />

      <div className="flex flex-col flex-grow overflow-hidden rounded-tl-[20px] rounded-tr-[20px] bg-white shadow-top px-12 py-4 animate-slideUp">
        <SearchTitleBar searchTitle={searchTerm} onSearch={handleSearch} />

        <div className="flex-grow overflow-y-auto custom-scrollbar space-y-6 pb-6">
          <DocumentList
            documents={filteredDocuments}
            handleDocumentClick={navigateToDetailPage}
          />
        </div>
      </div>

      {/* 서류 작성 아이콘 */}
      <div
          className="fixed z-40 bottom-20 transform translate-x-[50%] cursor-pointer"
          onClick={navigateToSubmitPage}
          style={{ right: 'calc(50% - 150px)' }}
        >
        <div
          className="z-50 w-[70px] h-[70px] rounded-full bg-[#ffec8a] flex items-center justify-center"
          style={{
            boxShadow:
              "0px 13px 27px -5px rgba(50,50,93,0.25), 0px 8px 16px -8px rgba(0,0,0,0.3)",
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
