
import axios, { AxiosResponse } from 'axios';
import { BASE_URL } from './config';
import type { GradeSheet, GradeSheetEntry, PaginatedResponse, PostGradesData, PdfResponse } from '../types';

export const grade_sheets = {
  getGradeSheetsByLevel: async (levelId: number, academicYear: string): Promise<GradeSheet[]> => {
    try {
      const response: AxiosResponse<PaginatedResponse<GradeSheet> | GradeSheet[] | { error: string }> = await axios.get(`${BASE_URL}/api/grade_sheets/by_level/`, {
        params: { level_id: levelId, academic_year: academicYear },
      });
      console.log('Raw GradeSheets API Response:', JSON.stringify(response.data, null, 2));
      let data: GradeSheet[];
      
      if ('error' in response.data) {
        console.warn('API returned error:', response.data.error);
        return []; // Return empty array for error responses
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
      return []; // Return empty array on error to prevent breaking
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

  postGrades: async (data: PostGradesData): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await axios.post(`${BASE_URL}/api/grade_sheets/input/`, data, {
        headers: { 'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] },
      });
      console.log('Post Grades Response:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error: any) {
      console.error('Post Grades Error:', JSON.stringify({
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      }, null, 2));
      throw error;
    }
  },

  generatePDF: async (levelId: number, academicYear: string, studentId?: number): Promise<PdfResponse> => {
    try {
      const response: AxiosResponse<PdfResponse> = await axios.get(`${BASE_URL}/api/grade_sheets/gradesheet/pdf/generate/`, {
        params: { level_id: levelId, academic_year: academicYear, student_id: studentId },
      });
      console.log('Generate PDF Response:', JSON.stringify(response.data, null, 2));
      if (!response.data.view_url) {
        throw new Error('No view_url in PDF response');
      }
      return response.data;
    } catch (error: any) {
      console.error('Generate PDF Error:', JSON.stringify({
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      }, null, 2));
      throw error;
    }
  },
};
export function postGrades(arg0: { level: number; subject_id: number; period_id: number; grades: { student_id: number; score: number; }[]; academic_year: string; }) {
  throw new Error('Function not implemented.');
}

export function printReportCard(selectedLevelId: number, academicYear: string, studentId: number | undefined, arg3: string): { view_url?: string; } | PromiseLike<{ view_url?: string; } | undefined> | undefined {
  throw new Error('Function not implemented.');
}


export function getGradesByLevel(selectedLevelId: number) {
  throw new Error('Function not implemented.');
}


