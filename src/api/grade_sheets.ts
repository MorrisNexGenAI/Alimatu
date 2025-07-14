import axios, { AxiosResponse } from 'axios';
import { BASE_URL } from './config';
import type { GradeSheet, GradeSheetEntry, PaginatedResponse, PdfResponse } from '../types';
import { apiClient } from '../api/apiClient';

export const grade_sheets = {

generatePDF: async (levelId: number, academicYear: number, studentId?: number): Promise<PdfResponse> => {
  return apiClient.pdfs.generatePeriodicPDF(levelId, academicYear, studentId);
},
}