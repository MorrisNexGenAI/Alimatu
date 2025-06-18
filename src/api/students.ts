import axios from 'axios';
import { BASE_URL } from './config';

import type { Student, PaginatedResponse } from '../types';
export const getStudents = async (params: { level_id: number; } | { level_id?: undefined; }): Promise<Student[]> => {
  const response = await axios.get(`${BASE_URL}/api/students/`);
  return response.data;
};

export const getStudentsByLevel = async (levelId: number, academicYear: string): Promise<Student[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/students/`, {
      params: { level_id: levelId, academic_year: academicYear },
    });
    console.log('Raw Students API Response:', JSON.stringify(response.data, null, 2));
    const data = response.data as PaginatedResponse<Student>;
    if (!Array.isArray(data.results)) {
      console.error('Invalid students response format:', JSON.stringify(data, null, 2));
      throw new Error(`Expected array in results, got ${typeof data.results}`);
    }
    return data.results;
  } catch (error: any) {
    console.error('Fetch Students Error:', JSON.stringify({
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    }, null, 2));
    throw error;
  }
};

export const addStudent = async (data: {
  firstName: string;
  lastName: string;
  gender: 'M' | 'F' | 'O';
  dob: string;
  level: number;
  academic_year: number;
}): Promise<Student> => {
  const response = await axios.post(`${BASE_URL}/api/students/`, data);
  return response.data;
};

export const updateStudent = async (id: number, data: {
  firstName: string;
  lastName: string;
  gender: 'M' | 'F' | 'O';
  dob: string;
  level: number;
  academic_year: number;
}): Promise<Student> => {
  const response = await axios.put(`${BASE_URL}/api/students/${id}/`, data);
  return response.data;
};

export const deleteStudent = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/api/students/${id}/`);
};