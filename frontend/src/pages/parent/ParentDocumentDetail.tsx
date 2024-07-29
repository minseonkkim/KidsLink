import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAbsentDocument, getDosageDocument } from '../../api/document';
import CommonHeader from '../../components/parent/common/CommonHeader';

interface DosageDocument {
  startDate: string;
  endDate: string;
  name: string;
  volume: string;
  times: string;
  storageInfo: string;
  details: string;
}

interface AbsentDocument {
  startDate: string;
  endDate: string;
  reason: string;
  details: string;
}


const isDosageDocument = (document: DosageDocument | AbsentDocument): document is DosageDocument => {
  return (document as DosageDocument).name !== undefined;
};

export default function DocumentDetail() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [document, setDocument] = useState<DosageDocument | AbsentDocument | null>(null);

  useEffect(() => {
    async function fetchDocument() {
      try {
        const documentId = parseInt(id);
        if (type === 'absent') {
          const data = await getAbsentDocument(documentId);
          setDocument(data);
        } else if (type === 'dosage') {
          const data = await getDosageDocument(documentId);
          setDocument(data);
        }
      } catch (error) {
        console.error('Failed to fetch document', error);
      }
    }

    fetchDocument();
  }, [type, id]);

  if (!document) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-white">
      <CommonHeader title="서류 상세" />
      <div className="w-full flex flex-col items-center mt-16 flex-grow">
        <div className="w-full p-8">
          <h2 className="text-2xl font-bold mb-4">{type === 'dosage' ? '투약 서류' : '결석 서류'}</h2>
          <p className="mb-2"><strong>날짜:</strong> {document.startDate} ~ {document.endDate}</p>
          {isDosageDocument(document) ? (
            <>
              <p className="mb-2"><strong>약의 종류:</strong> {document.name}</p>
              <p className="mb-2"><strong>용량:</strong> {document.volume}</p>
              <p className="mb-2"><strong>투약 시간:</strong> {document.times}</p>
              <p className="mb-2"><strong>보관 방법:</strong> {document.storageInfo}</p>
              <p className="mb-2"><strong>상세 내용:</strong> {document.details}</p>
            </>
          ) : (
            <>
              <p className="mb-2"><strong>사유:</strong> {document.reason}</p>
              <p className="mb-2"><strong>특이 사항:</strong> {document.details}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
