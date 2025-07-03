import axios, { AxiosResponse } from 'axios';
import { BASE_URL } from './config';
import type { Level, AcademicYear, Subject, Period, Student, PostGradesData, GradeResponse, ExistingGrade } from '../types/index';

// Helper function to fetch CSRF token
const getCsrfToken = async (): Promise<string> => {
  try {
    // Make a GET request to an endpoint that sets the CSRF cookie
    await axios.get(`${BASE_URL}/api/csrf/`, { withCredentials: true });
    const csrfToken = document.cookie.match(/csrftoken=([^;]+)/)?.[1];
    if (!csrfToken) {
      throw new Error('CSRF token not found in cookies');
    }
    console.log('Fetched CSRF Token:', csrfToken);
    return csrfToken;
  } catch (error: any) {
    console.error('Fetch CSRF Token Error:', JSON.stringify({
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    }, null, 2));
    throw error;
  }
};

export const gradesApi = {
  getLevels: async (): Promise<Level[]> => {
    try {
      const response: AxiosResponse<Level[]> = await axios.get(`${BASE_URL}/api/levels/`);
      console.log('Raw Levels Response:', JSON.stringify(response.data, null, 2));
      return response.data || [];
    } catch (error: any) {
      console.error('Fetch Levels Error:', JSON.stringify({
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      }, null, 2));
      throw error;
    }
  },

  getAcademicYears: async (): Promise<AcademicYear[]> => {
    try {
      const response: AxiosResponse<AcademicYear[]> = await axios.get(`${BASE_URL}/api/academic_years/`);
      console.log('Raw Academic Years Response:', JSON.stringify(response.data, null, 2));
      return response.data || [];
    } catch (error: any) {
      console.error('Fetch Academic Years Error:', JSON.stringify({
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      }, null, 2));
      throw error;
    }
  },

  getSubjectsByLevel: async (levelId: number): Promise<Subject[]> => {
    try {
      const response: AxiosResponse<Subject[]> = await axios.get(`${BASE_URL}/api/subjects/`, {
        params: { level_id: levelId },
      });
      console.log('Raw Subjects Response:', JSON.stringify(response.data, null, 2));
      return response.data || [];
    } catch (error: any) {
      console.error('Fetch Subjects Error:', JSON.stringify({
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      }, null, 2));
      throw error;
    }
  },

  getPeriods: async (): Promise<Period[]> => {
    try {
      const response: AxiosResponse<Period[]> = await axios.get(`${BASE_URL}/api/periods/`);
      console.log('Raw Periods Response:', JSON.stringify(response.data, null, 2));
      return response.data || [];
    } catch (error: any) {
      console.error('Fetch Periods Error:', JSON.stringify({
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      }, null, 2));
      throw error;
    }
  },

  getStudentsByLevel: async (levelId: number, academicYear: string): Promise<Student[]> => {
    try {
      const response: AxiosResponse<{ count: number; results: Student[] }> = await axios.get(`${BASE_URL}/api/students/`, {
        params: { level_id: levelId, academic_year: academicYear },
      });
      console.log('Raw Students Response:', JSON.stringify(response.data, null, 2));
      return response.data.results || [];
    } catch (error: any) {
      console.error('Fetch Students Error:', JSON.stringify({
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      }, null, 2));
      throw error;
    }
  },

  postGrades: async (data: PostGradesData): Promise<GradeResponse> => {
    try {
      const csrfToken = await getCsrfToken(); // Fetch CSRF token explicitly
      const response: AxiosResponse<GradeResponse> = await axios.post(`${BASE_URL}/api/grade_sheets/input/`, data, {
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
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

  getGradesByPeriodSubject: async (
    levelId: number,
    subjectId: number,
    periodId: number,
    academicYear: string
  ): Promise<ExistingGrade[]> => {
    try {
      const response: AxiosResponse<ExistingGrade[]> = await axios.get(`${BASE_URL}/api/grade_sheets/by_period_subject/`, {
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
      throw error;
    }
  },
};