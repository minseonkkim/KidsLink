import { useEffect, useState } from "react";
import DocumentItem from "./DocumentItem";
import { getAbsentDocument } from "../../../api/document";

interface AbsentDocumentProps {
  absentId: number;
}

export default function AbsentDocument({ absentId }: AbsentDocumentProps) {
  const [absentDocument, setAbsentDocument] = useState(null);

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

  if (!absentDocument) {
    return <div>Loading...</div>;
  }

  return (
    <div className="font-KoPubDotum w-[720px] h-[520px] rounded-[20px] bg-[#ffffff] border-[#B2D170] border-[3px] p-8">
      <div className="flex flex-row justify-between">
        <span className="rounded-[10px] bg-[#FFDFDF] flex items-center justify-center w-[75px] h-[40px] font-bold text-[20px]">결석</span>
        <div className="flex flex-row items-center h-[30px]">
          <input
            type="checkbox"
            className="mx-[3px] w-[20px] h-[20px] accent-[#363636]"
          />
          <span className="font-bold text-[18px] mx-3">확인완료</span>
        </div>
      </div>
      <div className="text-[20px] my-8">
        <DocumentItem title="기간" content={`${absentDocument.startDate} ~ ${absentDocument.endDate}`} />
        <DocumentItem title="사유" content={absentDocument.reason} />
        <DocumentItem title="기타사항" content={absentDocument.details} />
      </div>
    </div>
  );
}
