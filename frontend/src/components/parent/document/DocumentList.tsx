import DocumentItem from './DocumentItem'

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

interface DocumentListProps {
  documents: Document[];
  handleDocumentClick: (docType: string, docId: number) => void;
}

export default function DocumentList({ documents, handleDocumentClick }: DocumentListProps) {
  return (
    <div className="space-y-6">
      {documents.map((doc) => (
        <DocumentItem key={`${doc.type}-${doc.documentId}`} doc={doc} handleDocumentClick={handleDocumentClick} />
      ))}
    </div>
  )
}
