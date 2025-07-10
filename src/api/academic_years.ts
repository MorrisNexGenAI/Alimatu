import axios from 'axios';
import { BASE_URL } from './config';
import type { AcademicYear, PaginatedResponse } from '../types';

export const getAcademicYears = async (token: string): Promise<AcademicYear[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/academic_years/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Raw Academic Years API Response:', JSON.stringify(response.data, null, 2));
    const data = response.data as PaginatedResponse<AcademicYear>;
    if (!Array.isArray(data.results)) {
      throw new Error(`Expected array in results, got ${typeof data.results}`);
    }
    return data.results;
  } catch (error: any) {
    console.error('Fetch Academic Years Error:', JSON.stringify({
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    }, null, 2));
    throw error;
  }
};

export const createAcademicYear = async (data: { name: string; start_date: string; end_date: string }, token: string): Promise<AcademicYear> => {
  try {
    const response = await axios.post(`${BASE_URL}/api/academic_years/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '',
      },
    });
    console.log('Create Academic Year Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error: any) {
    console.error('Create Academic Year Error:', JSON.stringify({
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    }, null, 2));
    throw error;
  }
};

export const updateAcademicYear = async (id: number, data: { name: string; start_date: string; end_date: string }, token: string): Promise<AcademicYear> => {
  try {
    const response = await axios.put(`${BASE_URL}/api/academic_years/${id}/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '',
      },
    });
    console.log('Update Academic Year Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error: any) {
    console.error('Update Academic Year Error:', JSON.stringify({
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    }, null, 2));
    throw error;
  }
};

export const deleteAcademicYear = async (id: number, token: string): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/api/academic_years/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '',
      },
    });
    console.log(`Deleted Academic Year ID: ${id}`);
  } catch (error: any) {
    console.error('Delete Academic Year Error:', JSON.stringify({
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    }, null, 2));
    throw error;
  }
};