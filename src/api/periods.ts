import generalApi from './generalApi';
import  type { Period } from '../types';

export const getPeriods = async (): Promise<Period[]> => {
  try {
    const response = await generalApi.get('/periods');
    console.log('Periods API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Periods API error:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch periods: ${error.message}`);
    } else {
      throw new Error('Failed to fetch periods: Unknown error');
    }
  }
};