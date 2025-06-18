import axios from 'axios';
import { BASE_URL } from './config';
import type { Subject, PaginatedResponse } from '../types';

export const getSubjects = async (): Promise<Subject[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/subjects/`);
    console.log('Raw Subjects API Response:', JSON.stringify(response.data, null, 2));
    const data = response.data as PaginatedResponse<Subject>;
    if (!Array.isArray(data.results)) {
      throw new Error(`Expected array in results, got ${typeof data.results}`);
    }
    return data.results;
  } catch (error: any) {
    console.error('Fetch Subjects Error:', JSON.stringify({
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    }, null, 2));
    throw error;
  }
};

export const getSubjectsByLevel = async (levelId: number): Promise<Subject[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/subjects/`, {
      params: { level_id: levelId },
    });
    console.log('Raw Subjects by Level API Response:', JSON.stringify(response.data, null, 2));
    const data = response.data as PaginatedResponse<Subject>;
    if (!Array.isArray(data.results)) {
      throw new Error(`Expected array in results, got ${typeof data.results}`);
    }
    return data.results;
  } catch (error: any) {
    console.error('Fetch Subjects by Level Error:', JSON.stringify({
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    }, null, 2));
    throw error;
  }
};

export const createSubject = async (data: { subject: string; level: number }): Promise<Subject> => {
  try {
    const response = await axios.post(`${BASE_URL}/api/subjects/`, data, {
      headers: { 'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '' },
    });
    console.log('Create Subject Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error: any) {
    console.error('Create Subject Error:', JSON.stringify({
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    }, null, 2));
    throw error;
  }
};

export const deleteSubject = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/api/subjects/${id}/`, {
      headers: { 'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '' },
    });
    console.log(`Deleted Subject ID: ${id}`);
  } catch (error: any) {
    console.error('Delete Subject Error:', JSON.stringify({
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    }, null, 2));
    throw error;
  }
};