import { useEffect, useState } from "react";
import DocumentItem from "./DocumentItem";
import { checkAbsentDocument, getAbsentDocument } from "../../../api/document";
import { formatDate } from "../../../utils/teacher/formatDate";
import { showToastSuccess } from "../../../components/teacher/common/ToastNotification";
import ToastNotification from "../../../components/teacher/common/ToastNotification";

interface AbsentDocumentProps {
  absentId: number;
  onUpdate: () => void;
  isOurClass: boolean;
}

export default function AbsentDocument({ absentId, onUpdate, isOurClass }: AbsentDocumentProps) {
  const [absentDocument, setAbsentDocument] = useState<any>(null);

  useEffect(() => {
    const fetchAbsentDocument = async () => {
      try {
        const fetchedAbsentDocument = await getAbsentDocument(absentId);
        setAbsentDocument(fetchedAbsentDocument);
      } catch (error) {
        console.error('Failed to fetch absent document:', error);
      }
    };

    fetchAbsentDocument();
  }, [absentId]);

  const handleCheckboxClick = async () => {
    if (absentDocument?.confirmationStatus === "F") {
      try {
        await checkAbsentDocument(absentId);
        setAbsentDocument({ ...absentDocument, confirmationStatus: "T" });
        onUpdate(); 
        
        showToastSuccess(<div>문서가 승인되었습니다.</div>);
      } catch (error) {
        console.error('Failed to check absent document:', error);
      }
    }
  };

  const handleCheckboxChange = () => {};

  if (!absentDocument) {
    return <div>Loading...</div>;
  }

  const detailsContent = absentDocument.details ? absentDocument.details.split('\n').map((line, index) => (
    <p key={index} className="mb-2">{line}</p>
  )) : "";

  return (
    <div className="font-KoPubDotum w-full h-auto lg:h-[480px] rounded-[20px] bg-[#ffffff] p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row justify-between mb-4 lg:mb-0">
        <span className="rounded-[10px] bg-[#FFDFDF] flex items-center justify-center w-[75px] h-[40px] font-bold text-[20px] mb-4 lg:mb-0">결석</span>
        {isOurClass === false &&
          <div className="flex flex-row items-center h-[30px] lg:ml-auto">
            <input
              type="checkbox"
              className="mx-[3px] w-[20px] h-[20px] accent-[#363636]"
              checked={absentDocument.confirmationStatus === "T"}
              disabled={absentDocument.confirmationStatus === "T"}
              onClick={handleCheckboxClick}
              onChange={handleCheckboxChange}
            />
            <span className="font-bold text-[18px] mx-3">확인완료</span>
          </div>
        }
      </div>
      <div className="text-[16px] lg:text-[20px] my-4 lg:my-8 h-auto lg:h-[370px] overflow-y-auto custom-scrollbar">
        <DocumentItem title="기간" content={`${formatDate(absentDocument.startDate)} ~ ${formatDate(absentDocument.endDate)}`} />
        <DocumentItem title="사유" content={absentDocument.reason} />
        <DocumentItem 
          title="기타사항" 
          content={detailsContent} 
        />
      </div>
      <ToastNotification />
    </div>
  );
}
