import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_KEY;

interface Kindergarten {
  kindergartenId: number;
  kindergartenName: string;
}

interface KindergartenClass {
  kindergartenClassId: number;
  kindergartenClassName: string;
}

const getAllKindergartens = (): Promise<Kindergarten[]> => {
  return axios.get(`${API_BASE_URL}/kindergarten`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.data.data)
  .catch(error => {
    console.error('Error fetching kindergartens:', error);
    throw error;
  });
}

const getKindergartenClasses = (kindergartenId: number): Promise<KindergartenClass[]> => {
  return axios.get(`${API_BASE_URL}/kindergarten/${kindergartenId}`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.data.data)
  .catch(error => {
    console.error(`Error fetching classes for kindergarten ${kindergartenId}:`, error);
    throw error;
  });
}

export { getAllKindergartens, getKindergartenClasses };
