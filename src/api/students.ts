import generalApi from './generalApi';
import type { Student } from '../types';

export const getStudents = async (levelId?: number): Promise<Student[]> => {
  try {
    const url = levelId ? `/students?level_id=${levelId}` : '/students';
    const response = await generalApi.get(url);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch students: ${error.message}`);
    } else {
      throw new Error('Failed to fetch students: Unknown error');
    }
  }
};