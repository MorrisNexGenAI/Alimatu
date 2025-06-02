import axios from 'axios';
import { BASE_URL } from './config';
import { Student } from '../types';

export const getStudents = async (): Promise<Student[]> => {
  const response = await axios.get(`${BASE_URL}/api/students/`);
  return response.data;
};

export const getStudentsByLevel = async (levelId: number, academicYear?: string): Promise<Student[]> => {
  const params = academicYear ? { level_id: levelId, academic_year: academicYear } : { level_id: levelId };
  const response = await axios.get(`${BASE_URL}/api/students/`, { params });
  console.log('Students Data:', response.data);
  return response.data;
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