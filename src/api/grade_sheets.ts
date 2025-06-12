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
  const response = await axios.get(`${BASE_URL}/api/grade_sheets/by_level/`, { params });
  return response.data;
};

export const getGradesByPeriodSubject = async (
  levelId: number,
  subjectId: number,
  periodId: number,
  academicYear?: string
): Promise<GradeSheetEntry[]> => {
  const params = academicYear
    ? { level_id: levelId, subject_id: subjectId, period_id: periodId, academic_year: academicYear }
    : { level_id: levelId, subject_id: subjectId, period_id: periodId };
  const response = await axios.get(`${BASE_URL}/api/grade_sheets/by_period_subject/`, { params });
  return response.data;
};

export const postGrades = async (data: {
  level: number;
  subject_id: number;
  period_id: number;
  academic_year: string;
  grades: { student_id: number; score: number }[];
}): Promise<any> => {
  const response = await axios.post(`${BASE_URL}/api/grade_sheets/input/`, data);
  return response.data;
};

export const printReportCard = async (
  levelId: number,
  academicYear: string,
  studentId?: number,
  cardType: 'periodic' | 'yearly' = 'yearly'
): Promise<{ view_url: string }> => {
  try {
    const response = await axios.post(`${BASE_URL}/api/grade_sheets/report_card/print/`, {
      level_id: levelId,
      academic_year: academicYear,
      student_id: studentId,
      card_type: cardType,
      pass_template: true,
    });
    console.log('Print report card response:', response.data);
    return response.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Print report card error:', error);
    throw new Error(`Failed to print report card: ${message}`);
  }
};
