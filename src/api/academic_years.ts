import axios from 'axios';
import { BASE_URL } from './config';
import type { AcademicYear, PaginatedResponse } from '../types';

export const getAcademicYears = async (): Promise<AcademicYear[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/academic_years/`);
    console.log('Raw Academic Years API Response:', JSON.stringify(response.data, null, 2));
    const data = response.data as PaginatedResponse<AcademicYear>;
    if (!Array.isArray(data.results)) {
      throw new Error(`Expected array in results, got ${typeof data.results}`);
    }
    return data.results;
  } catch (error: any) {
    console.error('Fetch Academic Years Error:', JSON.stringify({
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    }, null, 2));
    throw error;
  }
};