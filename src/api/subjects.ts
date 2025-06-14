// src/api/subjects.ts
import axios from 'axios';
import { BASE_URL } from './config';
import { Subject } from '../types';

export const getSubjects = async (): Promise<Subject[]> => {
  const response = await axios.get(`${BASE_URL}/api/subjects/`);
  return response.data;
};

export const getSubjectsByLevel = async (levelId: number): Promise<Subject[]> => {
  const response = await axios.get(`${BASE_URL}/api/subjects/?level_id=${levelId}`);
  console.log('Subjects by Level Response:', response.data); // Debug
  return response.data;
};



export const createSubject = async (data: { subject: string; level: number }) => {
  const response = await axios.post(`${BASE_URL}/api/subjects/`, data);
  return response.data;
};

export const deleteSubject = async (id: number) => {
  await axios.delete(`${BASE_URL}/api/subjects/${id}/`);
};