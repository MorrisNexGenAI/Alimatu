import axios from 'axios';
import { BASE_URL } from './config';
import type { Period } from '../types';

export const getPeriods = async (): Promise<Period[]> => {
  const response = await axios.get(`${BASE_URL}/api/periods/`);
  return response.data;
};

