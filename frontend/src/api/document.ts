import axiosInstance from './token/axiosInstance'

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


// 반 전체 서류 조회
export async function getClassAllDocuments(){
  try {
    const response = await axiosInstance.get('document')

    if (response.data.status === 'success') {
      const documents = response.data.data.map((item: any) => {
        return {
          type: item.type,
          details: item.type === 'Absent' ? item.absent : item.dosage,
        };
      });
      return documents;
    } else {
      throw new Error('Failed to get documents');
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}


// 특정 아이의 모든 서류 조회
export async function getKidAllDocuments(childId: number) {
  try {
    const response = await axiosInstance.get(`document/child/${childId}`)

    if (response.data.status === 'success') {
      return response.data.data
    } else {
      throw new Error('Failed to get documents')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

// 결석 서류 상세 조회
export async function getAbsentDocument(absentId: number) {
  try  {
    const response = await axiosInstance.get(`document/absent/${absentId}`)

    if (response.data.status === 'success') {
      return response.data.data
    } else {
      throw new Error('Failed to get absent-document')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

// 투약 서류 상세 조회
export async function getDosageDocument(dosageId: number) {
  try  {
    const response = await axiosInstance.get(`document/dosage/${dosageId}`)

    if (response.data.status === 'success') {
      return response.data.data
    } else {
      throw new Error('Failed to get dosage-document')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

// 결석 서류 확인
export async function checkAbsentDocument(absentId: number) {
  try  {
    const response = await axiosInstance.put(`document/absent/${absentId}`)

    if (response.data.status === 'success') {
      return response.data.data
    } else {
      throw new Error('Failed to patch absent-document')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

// 투약 서류 확인
export async function checkDosageDocument(dosageId: number) {
  try  {
    const response = await axiosInstance.put(`document/dosage/${dosageId}`)

    if (response.data.status === 'success') {
      return response.data.data
    } else {
      throw new Error('Failed to patch dosage-document')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

// 투약 서류 작성
export async function createDosageDocument(data: DosageData, childId: number) {
  try {
    const response = await axiosInstance.post(`document/dosage/${childId}`, data);
    if (response.data.status === 'success') {
      return response.data.data;
    } else {
      throw new Error('Failed to post dosage-document');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// 결석 서류 작성
export async function createAbsentDocument(data: AbsentData, childId: number) {
  try {
    const response = await axiosInstance.post(`document/absent/${childId}`, data);

    if (response.data.status === 'success') {
      return response.data.data;
    } else {
      throw new Error('Failed to post absent-document');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// 날짜별 아이 서류 조회
export async function getDocumentsByDate(childId: number, date: string){
  try{
    const response = await axiosInstance.get(`child/${childId}/document/check?date=${date}`)
    if(response.data.status === 'success'){
      return response.data.data
    }
  }catch (error) {
    console.error(error);
    throw error;
  }
}