import generalApi from './generalApi';
import type { PassFailedStatus } from '../types';

export const getStatusesByLevelAndYear = async (
  levelId: number,
  academicYearId: number,
): Promise<PassFailedStatus[]> => {
  try {
    const response = await generalApi.get('/pass_failed_statuses/', {
      params: { level_id: levelId, academic_year_id: academicYearId },
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch statuses: ${error.message}`);
    } else {
      throw new Error('Failed to fetch statuses: Unknown error');
    }
  }
};

export const validateStatus = async (
  statusId: number,
  status: 'PASS' | 'FAIL' | 'CONDITIONAL',
  validatedBy: string,
): Promise<PassFailedStatus> => {
  console.log('Validating status for ID:', statusId, 'with data:', { status, validated_by: validatedBy });
  try {
    const response = await generalApi.post(`/pass_failed_statuses/${statusId}/validate/`, {
      status,
      validated_by: validatedBy,
    });
    console.log('Validate status response:', response.data);
    return response.data;
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'response' in error && typeof (error as any).response === 'object') {
      console.error('Validate status error:', JSON.stringify((error as any).response?.data || (error as any).message, null, 2));
      throw new Error(`Failed to validate status: ${JSON.stringify((error as any).response?.data || (error as any).message)}`);
    } else if (error instanceof Error) {
      console.error('Validate status error:', error.message);
      throw new Error(`Failed to validate status: ${error.message}`);
    } else {
      console.error('Validate status error:', error);
      throw new Error('Failed to validate status: Unknown error');
    }
  }
};

export const promoteStudent = async (statusId: number): Promise<{ message: string }> => {
  console.log('Promoting student for status ID:', statusId);
  try {
    const response = await generalApi.post(`/pass_failed_statuses/${statusId}/promote/`);
    console.log('Promote student response:', response.data);
    return response.data;
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'response' in error && typeof (error as any).response === 'object') {
      console.error('Promote student error:', JSON.stringify((error as any).response?.data || (error as any).message, null, 2));
      throw new Error(`Failed to promote student: ${JSON.stringify((error as any).response?.data || (error as any).message)}`);
    } else if (error instanceof Error) {
      console.error('Promote student error:', error.message);
      throw new Error(`Failed to promote student: ${error.message}`);
    } else {
      console.error('Promote student error:', error);
      throw new Error('Failed to promote student: Unknown error');
    }
  }
};

export const printReportCard = async (
  levelId: number,
  academicYearId: number,
  studentId?: number,
): Promise<{ view_url: string }> => {
  console.log('Printing report card:', { levelId, academicYearId, studentId });
  try {
    const response = await generalApi.post('/pass_failed_statuses/print/', {
      level_id: levelId,
      academic_year_id: academicYearId,
      student_id: studentId,
    });
    console.log('Print report card response:', response.data);
    return response.data;
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'response' in error && typeof (error as any).response === 'object') {
      console.error('Print report card error:', JSON.stringify((error as any).response?.data || (error as any).message, null, 2));
      throw new Error(`Failed to print report card: ${JSON.stringify((error as any).response?.data || (error as any).message)}`);
    } else if (error instanceof Error) {
      console.error('Print report card error:', error.message);
      throw new Error(`Failed to print report card: ${error.message}`);
    } else {
      console.error('Print report card error:', error);
      throw new Error('Failed to print report card: Unknown error');
    }
  }
};
