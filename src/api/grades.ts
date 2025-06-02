import generalApi from './generalApi';
import type { GradeSheetEntry } from '../types';

export const getGradesByPeriodSubject = async (
  levelId: number,
  subjectId: number,
  periodId: number,
): Promise<GradeSheetEntry[]> => {
  try {
    const response = await generalApi.get('/grade_sheets/by_period_subject/', {
      params: { level_id: levelId, subject_id: subjectId, period_id: periodId },
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch grades: ${error.message}`);
    } else {
      throw new Error('Failed to fetch grades: Unknown error');
    }
  }
};