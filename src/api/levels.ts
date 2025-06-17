import axios from 'axios';
import { BASE_URL } from './config';
import type { Level } from '../types';

export const getLevels = async (): Promise<Level[]> => {
  const response = await axios.get(`${BASE_URL}/api/levels/`);
  return response.data;
};


export const createLevel = async (data: {level:string; academic_year:string }) =>{
  const response = await axios.post (`${BASE_URL}/api/levels/`, data);
  return response.data;
}

export const deleteLevel = async(id:number)=>{
  await axios.delete(`{BASE_URL}/api/levels/${id}/`);
}

