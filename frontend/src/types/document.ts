
export interface ParentDosageData {
  dosageId: number;
  name: string;
  confirmationStatus: string;
  startDate: string;
  endDate: string;
  details: string;
  num: string;
  times: string;
  storageInfo: string;
  volume: string;
}

export interface ParentAbsentData {
  absentId: number;
  reason: string;
  confirmationStatus: string;
  startDate: string;
  endDate: string;
  details: string;
}

export interface ParentDocumentData {
  id: number;
  date: string;
  dosage?: ParentDosageData;
  absent?: ParentAbsentData;
}

export interface DosageData {
  dosageId: number;
  name: string;
  confirmationStatus: string;
  startDate: string;
  endDate: string;
  details: string;
  num: string;
  times: string;
  storageInfo: string;
  volume: string;
  childId: number;
  childName: string;
}

export interface AbsentData {
  absentId: number;
  reason: string;
  confirmationStatus: string;
  startDate: string;
  endDate: string;
  details: string;
  childId: number;
  childName: string;
}

export interface Document {
  type: 'Absent' | 'Dosage';
  details: AbsentData | DosageData;
}

export interface DocumentDetail {
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
