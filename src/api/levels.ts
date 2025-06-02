import generalApi from './generalApi';
import type { Level } from '../types';

export const getLevels = async (): Promise<Level[]> => {
  try {
    const response = await generalApi.get('/levels');
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch levels: ${error.message}`);
    } else {
      throw new Error('Failed to fetch levels: Unknown error');
    }
  }
};