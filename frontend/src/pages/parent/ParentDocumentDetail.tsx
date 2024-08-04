import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAbsentDocument, getDosageDocument } from '../../api/document';

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
  const { docType, docId } = useParams<{ docType: string; docId: string }>();
  const [document, setDocument] = useState<DosageDocument | AbsentDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDocument() {
      try {
        const documentId = parseInt(docId);
        if (docType === 'absent') {
          const data = await getAbsentDocument(documentId);
          setDocument(data);
        } else if (docType === 'dosage') {
          const data = await getDosageDocument(documentId);
          setDocument(data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch document', error);
        setError('Failed to fetch document');
        setLoading(false);
      }
    }

    fetchDocument();
  }, [docType, docId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!document) {
    return <p>해당 문서를 찾을 수 없습니다.</p>;
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between bg-white">
      <div className="flex flex-1 flex-col my-16 items-center px-6">
        <div className="relative w-full mt-16 mb-12">
          <div className="relative w-full bg-[#fff9d7] rounded-[20px] px-6 py-8 shadow-lg border-2 border-[#ffec8a] bg-notebook-pattern">
            {/* 테이프 효과 */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-yellow-300 z-10"></div>

            <p className="text-[20px] font-bold text-[#212121] mb-2 text-center">
              {docType === 'dosage' ? '투약 서류' : '결석 서류'}
            </p>
            <p className="text-[14px] font-light text-[#353c4e] mb-6 text-center">
              {formatDate(document.startDate)} ~ {formatDate(document.endDate)}
            </p>
            <div className="text-[16px] text-[#212121] space-y-4 whitespace-pre-line">
              {isDosageDocument(document) ? (
                <>
                  <p><strong>약의 종류:</strong> {document.name}</p>
                  <p><strong>용량:</strong> {document.volume}</p>
                  <p><strong>투약 시간:</strong> {document.times}</p>
                  <p><strong>보관 방법:</strong> {document.storageInfo}</p>
                  <p><strong>상세 내용:</strong> {document.details}</p>
                </>
              ) : (
                <>
                  <p><strong>사유:</strong> {document.reason}</p>
                  <p><strong>특이 사항:</strong> {document.details}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
