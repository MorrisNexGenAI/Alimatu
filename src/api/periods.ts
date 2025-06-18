import axios from 'axios';
import { BASE_URL } from './config';
import type { Period } from '../types';

export const getPeriods = async (): Promise<Period[]> => {
  const response = await axios.get(`${BASE_URL}/api/periods/`);
  return response.data;
};

export const createPeriods = async (data: {level:string; academic_year:string }) =>{
  const response = await axios.post (`${BASE_URL}/api/periodss/`, data);
  return response.data;
}

export const deleteLevel = async(id:number)=>{
  await axios.delete(`{BASE_URL}/api/levels/${id}/`);
}
