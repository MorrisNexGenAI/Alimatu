// src/lib/api/students.ts
import axios from '../axios';
import type { Student } from '../../types/student';

export const getAllStudents = async (): Promise<Student[]> => {
  const response = await axios.get('/students/');
  return response.data;
};
