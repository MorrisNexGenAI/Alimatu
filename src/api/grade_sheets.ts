import axios from 'axios';
import { BASE_URL } from './config';
import type { GradeSheetEntry, GradeSheet } from '../types';

export interface GradeSheet {
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

export const getGradeSheetsByLevel = async (levelId: number): Promise<GradeSheet[]> => {
  const response = await axios.get(`${BASE_URL}/api/grade_sheets/by_level/?level_id=${levelId}`);
  return response.data;
};

export const getGradesByPeriodSubject = async (
  levelId: number,
  subjectId: number,
  periodId: number
): Promise<GradeSheetEntry[]> => {
  const response = await axios.get(
    `${BASE_URL}/api/grade_sheets/by_period_subject/?level_id=${levelId}&subject_id=${subjectId}&period_id=${periodId}`
  );
  return response.data;
};

export const postGrades = async (data: {
  level: number;
  subject_id: number;
  period_id: number;
  grades: { student_id: number; score: number }[];
}): Promise<any> => {
  const response = await axios.post(`${BASE_URL}/api/grade_sheets/input/`, data);
  return response.data;
};