import axiosInstance from './token/axiosInstance'

interface DosageData {
  dosageId: number;
  startDate: string;
  name: string;
  volume: string;
  times: string;
  storageInfo: string;
  details: string;
  confirmationStatus: string;
  childId: number;
}

interface AbsentData {
  absentId: number;
  startDate: string;
  endDate: string;
  reason: string;
  specialNotes: string;
  confirmationStatus: string;
  childId: number;
}

export interface Document {
  id: null
  data: string;
  type: string;
  dosage: DocumentData | null;
  absent: AbsentData | null;
}


// 반 전체 서류 조회
export async function getClassAllDocuments(): Promise<Document[]> {
  try {
    const response = await axiosInstance.get('document')

    if (response.data.status === 'success') {
      console.log(response.data.data) // 확인 후 삭제
      return response.data.data
    } else {
      throw new Error('Failed to get documents')
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
      console.log(response.data.data) // 확인 후 삭제
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
      console.log(response.data.data) // 확인 후 삭제
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
      console.log(response.data.data) // 확인 후 삭제
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
    const response = await axiosInstance.patch(`document/absent/${absentId}`)

    if (response.data.status === 'success') {
      console.log(response.data.data) // 확인 후 삭제
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
    const response = await axiosInstance.patch(`document/dosage/${dosageId}`)

    if (response.data.status === 'success') {
      console.log(response.data.data) // 확인 후 삭제
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
export async function createDosageDocument(data: DosageData) {
  try {
    const response = await axiosInstance.post('document/dosage', data);

    if (response.data.status === 'success') {
      console.log(response.data.data); // 확인 후 삭제
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
export async function createAbsentDocument(data: AbsentData) {
  try {
    const response = await axiosInstance.post('document/absent', data);

    if (response.data.status === 'success') {
      console.log(response.data.data); // 확인 후 삭제
      return response.data.data;
    } else {
      throw new Error('Failed to post absent-document');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
