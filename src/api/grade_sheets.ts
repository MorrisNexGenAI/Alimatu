import axios, { AxiosResponse } from 'axios';
import { BASE_URL } from './config';
import type { GradeSheet, GradeSheetEntry, PaginatedResponse, PdfResponse } from '../types';
import { pdfs } from './pdfs';

export const grade_sheets = {
  getGradeSheetsByLevel: async (levelId: number, academicYear: string): Promise<GradeSheet[]> => {
    try {
      const response: AxiosResponse<PaginatedResponse<GradeSheet> | GradeSheet[] | { error: string }> = await axios.get(`${BASE_URL}/api/grade_sheets/by_level/`, {
        params: { level_id: levelId, academic_year: academicYear },
        withCredentials: true,
        headers: { Accept: 'application/json' },
      });
      console.log('Raw GradeSheets API Response:', JSON.stringify(response.data, null, 2));
      let data: GradeSheet[];
      
      if ('error' in response.data) {
        console.warn('API returned error:', response.data.error);
        return [];
      }
      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (response.data && typeof response.data === 'object' && Array.isArray(response.data.results)) {
        data = response.data.results;
      } else {
        console.error('Invalid gradesheets response format:', JSON.stringify(response.data, null, 2));
        throw new Error(`Expected array or paginated results, got ${typeof response.data}`);
      }
      return data;
    } catch (error: any) {
      console.error('Fetch GradeSheets Error:', JSON.stringify({
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      }, null, 2));
      return [];
    }
  },

  getGradesByPeriodSubject: async (
    levelId: number,
    subjectId: number,
    periodId: number,
    academicYear: string
  ): Promise<GradeSheetEntry[]> => {
    try {
      const response: AxiosResponse<GradeSheetEntry[]> = await axios.get(`${BASE_URL}/api/grade_sheets/by_period_subject/`, {
        params: { level_id: levelId, subject_id: subjectId, period_id: periodId, academic_year: academicYear },
        withCredentials: true,
        headers: { Accept: 'application/json' },
      });
      console.log('Raw Grades By Period Subject Response:', JSON.stringify(response.data, null, 2));
      return response.data || [];
    } catch (error: any) {
      console.error('Fetch Grades Error:', JSON.stringify({
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      }, null, 2));
      return [];
    }
  },

  generatePDF: async (levelId: number, academicYear: string, studentId?: number): Promise<PdfResponse> => {
    return pdfs.generatePeriodicPDF(levelId, academicYear, studentId);
  },

  postGrades: async (data: { level: number; subject_id: number; period_id: number; grades: { student_id: number; score: number; period_id: number }[]; academic_year: number }): Promise<any> => {
    throw new Error('Use gradesApi.postGrades from api/grades.ts instead.');
  },

  getGradesByLevel: async (levelId: number): Promise<any> => {
    throw new Error('Function not implemented.');
  },
};

export function postGrades(arg0: { level: number; subject_id: number; period_id: number; grades: { student_id: number; score: number; period_id: number; }[]; academic_year: number; }) {
  throw new Error('Function not implemented.');
}
export function getGradesByLevel(selectedLevelId: number): any {
  throw new Error('Function not implemented.');
}

