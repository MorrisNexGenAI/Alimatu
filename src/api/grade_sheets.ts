import axios from 'axios';
import { BASE_URL } from './config';
import type { GradeSheetEntry } from '../types';

interface GradeSubmission {
  level: number;
  subject_id: number;
  period_id: number;
  academic_year: string;
  grades: { student_id: number; score: number }[];
}

interface GradeSubmissionResponse {
  message: string;
  saved_grades: number[];
  skipped_students: number[];
  errors: { student_id: number; error: string }[];
}

export const postGrades = async (data: GradeSubmission): Promise<GradeSubmissionResponse> => {
  const requestDetails = {
    url: `${BASE_URL}/api/grade_sheets/input/`,
    data,
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || 'missing',
    },
  };
  console.log('Sending POST request to /api/grade_sheets/input/:', requestDetails);
  try {
    const response = await axios.post<GradeSubmissionResponse>(requestDetails.url, requestDetails.data, {
      headers: requestDetails.headers,
    });
    console.log('Post Grades Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Post Grades Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      request: requestDetails,
    });
    throw error;
  }
};

export const getGradesByPeriodSubject = async (
  levelId: number,
  subjectId: number,
  periodId: number,
  academicYear: string
): Promise<GradeSheetEntry[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/grade_sheets/by_period_subject/`, {
      params: { level_id: levelId, subject_id: subjectId, period_id: periodId, academic_year: academicYear },
    });
    console.log('Get Grades Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get Grades Error:', error);
    throw error;
  }
};