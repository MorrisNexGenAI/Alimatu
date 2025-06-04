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

export async function addGrade(gradeData: { student_id: number; subject_id: number; period_id: number; score: number | null }[]) {
  console.log('Sending grade data to add:', gradeData); // Debug log

  // Transform gradeData to match the expected backend format
  if (!gradeData.length) {
    throw new Error('No grade data provided');
  }

  const { subject_id, period_id } = gradeData[0]; // Assuming all entries have the same subject_id and period_id
  const level = 1; // You may need to dynamically fetch or pass the level_id

  const formattedData = {
    level,
    subject_id,
    period_id,
    grades: gradeData.map(({ student_id, score }) => ({ student_id, score })),
  };

  console.log('Formatted grade data:', formattedData); // Debug log

  try {
    const response = await generalApi.post('/grade_sheets/input/', formattedData);
    console.log('Add grade response:', response.data); // Debug log
    return response.data;
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'response' in error && typeof (error as any).response === 'object' && (error as any).response !== null && 'data' in (error as any).response) {
      console.error('Add grade error response:', JSON.stringify((error as any).response.data, null, 2)); // Enhanced error logging
      throw new Error(`Failed to add grades: ${JSON.stringify((error as any).response.data)}`);
    } else if (error instanceof Error) {
      console.error('Add grade error:', error.message); // Log error details
      throw new Error(`Failed to add grades: ${error.message}`);
    } else {
      console.error('Add grade error:', error); // Log error details
      throw new Error('Failed to add grades: Unknown error');
    }
  }
}

export async function updateGrade(id: number, data: { score: number | null }) {
  console.log('Sending update for grade ID:', id, 'with data:', data); // Debug log
  try {
    const response = await generalApi.put(`/grades/${id}/`, data);
    console.log('Update grade response:', response.data); // Debug log
    return response.data;
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'response' in error && typeof (error as any).response === 'object') {
      console.error('Update grade error:', JSON.stringify((error as any).response?.data || (error as any).message, null, 2)); // Enhanced error logging
      throw new Error(`Failed to update grade: ${JSON.stringify((error as any).response?.data || (error as any).message)}`);
    } else if (error instanceof Error) {
      console.error('Update grade error:', error.message); // Log error details
      throw new Error(`Failed to update grade: ${error.message}`);
    } else {
      console.error('Update grade error:', error); // Log error details
      throw new Error('Failed to update grade: Unknown error');
    }
  }
}