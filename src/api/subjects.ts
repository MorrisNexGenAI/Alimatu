import axios, { AxiosResponse } from 'axios';
import { BASE_URL } from './config';
import type { Subject, PaginatedResponse } from '../types';

export const getSubjects = async (token: string, levelId?: number): Promise<Subject[]> => {
  try {
    const response: AxiosResponse<PaginatedResponse<Subject> | Subject[]> = await axios.get(`${BASE_URL}/api/subjects/`, {
      headers: { Authorization: `Bearer ${token}` },
      params: levelId ? { level_id: levelId } : {},
    });
    console.log('Raw Subjects API Response:', JSON.stringify(response.data, null, 2));
    let data: Subject[];
    if (Array.isArray(response.data)) {
      data = response.data;
    } else if (response.data && typeof response.data === 'object' && Array.isArray(response.data.results)) {
      data = response.data.results;
    } else {
      console.error('Invalid subjects response format:', JSON.stringify(response.data, null, 2));
      return [];
    }
    return data;
  } catch (error: any) {
    console.error('Fetch Subjects Error:', JSON.stringify({
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    }, null, 2));
    return [];
  }
};

export const getSubjectsByLevel = async (levelId: number, token: string): Promise<Subject[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/subjects/`, {
      headers: { Authorization: `Bearer ${token}` },
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

export const createSubject = async (data: { subject: string; level_id: number }, token: string): Promise<Subject> => {
  try {
    const response = await axios.post(`${BASE_URL}/api/subjects/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '',
      },
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

export const updateSubject = async (id: number, data: { subject: string; level_id: number }, token: string): Promise<Subject> => {
  try {
    const response = await axios.put(`${BASE_URL}/api/subjects/${id}/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '',
      },
    });
    console.log('Update Subject Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error: any) {
    console.error('Update Subject Error:', JSON.stringify({
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    }, null, 2));
    throw error;
  }
};

export const deleteSubject = async (id: number, token: string): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/api/subjects/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '',
      },
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