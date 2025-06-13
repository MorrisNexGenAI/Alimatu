import axios from 'axios';
import { BASE_URL } from './config';
import type { GradeSheet, GradeSheetEntry } from '../types';

export interface GradeSheets {
  student_id: number;
  student_name: string;
  subjects: {
    subject_id: number;
    subject_name: string;
    '1st': number | null;
    '2nd': number | null;
    '3rd': number | null;
    '1exam': number | null;
    '4th': number | null;
    '5th': number | null;
    '6th': number | null;
    '2exam': number | null;
    sem1_avg: number | null;
    sem2_avg: number | null;
    final_avg: number | null;
  }[];
}

export const getGradeSheetsByLevel = async (levelId: number, academicYear?: string): Promise<GradeSheet[]> => {
  const params = academicYear ? { level_id: levelId, academic_year: academicYear } : { level_id: levelId };
  console.log('Fetching grade sheets with params:', params);
  try {
    const response = await axios.get(`${BASE_URL}/api/grade_sheets/by_level/`, { params });
    console.log('Grade Sheets Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch Grade Sheets Error:', error);
    throw error;
  }
};

export const getGradesByPeriodSubject = async (
  levelId: number,
  subjectId: number,
  periodId: number | null,
  academicYear?: string
): Promise<GradeSheetEntry[]> => {
  const params: Record<string, string> = {
    level_id: levelId.toString(),
    subject_id: subjectId.toString(),
  };
  if (periodId !== null) {
    params.period_id = periodId.toString();
  }
  if (academicYear) {
    params.academic_year = academicYear;
  }
  console.log('Fetching grades with params:', params);
  try {
    const response = await axios.get(`${BASE_URL}/api/grade_sheets/by_period_subject/`, { params });
    console.log('Grades Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch Grades Error:', error);
    throw error;
  }
};

export const postGrades = async (data: {
  level: number;
  subject_id: number;
  period_id?: number;
  academic_year: string;
  grades: { student_id: number; score: number; period_id?: number }[];
}): Promise<any> => {
  const requestDetails = {
    url: `${BASE_URL}/api/grade_sheets/input/`,
    data,
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || 'missing'
    }
  };
  console.log('Sending POST request:', requestDetails);
  try {
    const response = await axios.post(requestDetails.url, data, {
      headers: requestDetails.headers
    });
    console.log('POST Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Post Grades Error:', error);
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response: { status: number; data: any; headers: any } };
      console.error('Response Error:', err.response.status, err.response.data, err.response.headers);
    }
    throw error;
  }
};

export const printReportCard = async (
  levelId: number,
  academicYear: string,
  studentId?: number,
  cardType: 'periodic' | 'yearly' = 'yearly'
): Promise<{ view_url: string }> => {
  try {
    const data = {
      level_id: levelId,
      academic_year: academicYear,
      student_id: studentId,
      card_type: cardType,
      pass_template: true,
    };
    console.log('Sending print report card request:', { url: `${BASE_URL}/api/grade_sheets/report_card/print/`, data });
    const response = await axios.post(`${BASE_URL}/api/grade_sheets/report_card/print/`, data);
    console.log('Print report card response:', response.data);
    return response.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Print report card error:', error);
    throw new Error(`Failed to print report card: ${message}`);
  }
};