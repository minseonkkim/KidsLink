import checkedIcon from '../../../assets/parent/check.png'
import { FaPills, FaRegTimesCircle } from "react-icons/fa"
import { DocumentDetail } from "../../../types/document"


interface DocumentItemProps {
  doc: DocumentDetail;
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
              {doc.type === 'dosage' ? (
                <FaPills className="w-4 h-4 mr-2 text-purple-600" aria-label="pill" />
              ) : (
                <FaRegTimesCircle className="w-4 h-4 mr-2 text-red-600" aria-label="absent" />
              )}
            <p className="text-lg font-bold text-[#353c4e] pt-1">
              {doc.title}
            </p>
          </div>
        </div>
        {doc.checked && (
          <img
            src={checkedIcon}
            alt="checked"
            className="w-[24px] h-[24px] ml-auto object-contain"
          />
        )}
      </div>
    </div>
  )
}
