import axios, { AxiosResponse } from 'axios';
import { BASE_URL } from './config';
import type { PdfResponse } from '../types';

const getCsrfToken = async (): Promise<string> => {
  try {
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

export const pdfs = {
  generatePeriodicPDF: async (
    levelId: number,
    academicYear: string,
    studentId?: number
  ): Promise<PdfResponse> => {
    try {
      const csrfToken = await getCsrfToken();
      const params: { level_id: number; academic_year: string; student_id?: number } = {
        level_id: levelId,
        academic_year: academicYear,
      };
      if (studentId) {
        params.student_id = studentId;
      }
      const response: AxiosResponse<PdfResponse> = await axios.get(
        `${BASE_URL}/api/grade_sheets_pdf/gradesheet/pdf/generate/`,
        {
          params,
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
            'Accept': 'application/json',
          },
          withCredentials: true,
        }
      );
      console.log('Generate Periodic PDF Response:', JSON.stringify(response.data, null, 2));
      if (!response.data.view_url) {
        throw new Error('No view_url in PDF response');
      }
      return response.data;
    } catch (error: any) {
      console.error('Generate Periodic PDF Error:', JSON.stringify({
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      }, null, 2));
      throw error;
    }
  },

  generateYearlyPDF: async (
    levelId: number,
    academicYear: string,
    studentId?: number
  ): Promise<PdfResponse> => {
    try {
      const csrfToken = await getCsrfToken();
      const params: { level_id: number; academic_year: string; student_id?: number } = {
        level_id: levelId,
        academic_year: academicYear,
      };
      if (studentId) {
        params.student_id = studentId;
      }
      const response: AxiosResponse<PdfResponse> = await axios.get(
        `${BASE_URL}/api/grade_sheets_pdf/yearly/pdf/generate/`,
        {
          params,
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
            'Accept': 'application/json',
          },
          withCredentials: true,
        }
      );
      console.log('Generate Yearly PDF Response:', JSON.stringify(response.data, null, 2));
      if (!response.data.view_url) {
        throw new Error('No view_url in PDF response');
      }
      return response.data;
    } catch (error: any) {
      console.error('Generate Yearly PDF Error:', JSON.stringify({
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      }, null, 2));
      throw error;
    }
  },
};