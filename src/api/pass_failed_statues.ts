import axios from 'axios';
import { BASE_URL } from './config';
import type { PassFailedStatus } from '../types';


const getCsrfToken = (): string | null => {
  const name = 'csrftoken';
  const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];
  return cookieValue || null;
};

export const getStatusesByLevelAndYear = async (
  levelId: number,
  academicYear: string
): Promise<PassFailedStatus[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/pass_failed_statuses/`, {
      params: { level_id: levelId, academic_year: academicYear },
    });
    console.log('Statuses response:', response.data);
    return response.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Get statuses error:', error);
    throw new Error(`Failed to fetch statuses: ${message}`);
  }
};

export const validateStatus = async (
  statusId: number,
  status: 'PASS' | 'FAIL' | 'CONDITIONAL',
  validatedBy: string
): Promise<PassFailedStatus> => {
  console.log('Validating status for ID:', statusId, 'with data:', { status, validated_by: validatedBy });
  try {
    const response = await axios.post(`${BASE_URL}/api/pass_failed_statuses/${statusId}/validate/`, {
      status,
      validated_by: validatedBy,
    });
    console.log('Validate status response:', response.data);
    return response.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Validate status error:', error);
    throw new Error(`Failed to validate status: ${message}`);
  }
};

export const promoteStudent = async (
  statusId: number,
  levelId: number,
  promotedBy: string
): Promise<{ message: string; new_level_id: number }> => {
  console.log('Promoting student:', { statusId, levelId, promotedBy });
  try {
    const csrfToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('csrftoken='))
      ?.split('=')[1] || null;
    if (!csrfToken) throw new Error('CSRF token not found');
    const response = await axios.post(
      `${BASE_URL}/api/pass_failed_statuses/${statusId}/promote/`,
      { level_id: levelId, role: 'admin' },
      { headers: { 'X-CSRFToken': csrfToken } }
    );
    console.log('Promote student response:', response.data);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.error || (error instanceof Error ? error.message : 'Unknown error');
    console.error('Promote student error:', error);
    throw new Error(`Failed to promote student: ${message}`);
  }
};