import axios from 'axios';
import { BASE_URL } from './config';
import type { Level } from '../types';

export const getLevels = async (): Promise<Level[]> => {
  const response = await axios.get(`${BASE_URL}/api/levels/`);
  return response.data;
};