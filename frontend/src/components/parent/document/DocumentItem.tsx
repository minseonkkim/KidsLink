import pill from '../../../assets/parent/pill.png'
import absentIcon from '../../../assets/parent/absent.png'
import checkedIcon from '../../../assets/parent/check.png'

interface Document {
  id: number;
  date: string;
  type: 'dosage' | 'absent';
  checked: boolean;
  startDate: string;
  endDate: string;
  documentId: number;
  title: string;
  details: string;
  childId: number;
}

interface DocumentItemProps {
  doc: Document;
  handleDocumentClick: (docType: string, docId: number) => void;
}

export default function DocumentItem({ doc, handleDocumentClick }: DocumentItemProps) {
  return (
    <div
      className={`flex flex-col p-4 rounded-2xl bg-[#FFF9D7] border-1 border-[#FFEC8A] hover:bg-[#ffec8a] transition-colors duration-200 cursor-pointer`}
      onClick={() => handleDocumentClick(doc.type, doc.documentId)}
    >
      <div className="flex items-center">
        <div>
          <p className="text-base font-bold text-[#757575]">
            {`${doc.startDate} ~ ${doc.endDate}`}
          </p>
          <div className="flex items-center">
            <img
              src={doc.type === 'dosage' ? pill : absentIcon}
              alt={doc.type === 'dosage' ? 'pill' : 'absent'}
              className="w-7 h-7 mr-4"
            />
            <p className="text-lg font-bold text-[#353c4e] pt-1">
              {doc.title}
            </p>
          </div>
        </div>
        {doc.checked && (
          <img
            src={checkedIcon}
            alt="checked"
            className="w-[30px] h-[30px] ml-auto object-contain"
          />
        )}
      </div>
    </div>
  )
}
