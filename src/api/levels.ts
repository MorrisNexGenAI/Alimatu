// api/levels.ts
import axios from 'axios';
import { BASE_URL } from './config';
import type { Level, PaginatedResponse } from '../types';

export const getLevels = async (): Promise<Level[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/levels/`);
    console.log('Raw Levels API Response:', JSON.stringify(response.data, null, 2));
    const data = response.data as PaginatedResponse<Level>;
    if (!Array.isArray(data.results)) {
      throw new Error(`Expected array in results, got ${typeof data.results}`);
    }
    return data.results;
  } catch (error: any) {
    console.error('Fetch Levels Error:', JSON.stringify({
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    }, null, 2));
    throw error;
  }
};