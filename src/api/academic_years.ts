import axios from 'axios';
import { BASE_URL } from './config';

export interface AcademicYear {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
}

export const getAcademicYears = async (): Promise<AcademicYear[]> => {
  const response = await axios.get(`${BASE_URL}/api/academic_years/`);
  return response.data;
};