import generalApi from './generalApi';
import type { Subject } from '../types';

export const getSubjects = async (levelId?: number): Promise<Subject[]> => {
  try {
    const url = levelId ? `/subjects?level_id=${levelId}` : '/subjects';
    const response = await generalApi.get(url);
    console.log('Subjects API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Subjects API error:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch subjects: ${error.message}`);
    } else {
      throw new Error('Failed to fetch subjects: Unknown error');
    }
  }
};