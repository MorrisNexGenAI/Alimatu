import axios, { AxiosResponse } from 'axios';
import { BASE_URL } from './config';
import type { PaginatedResponse, Period } from '../types';


export const getPeriods = async (): Promise<Period[]> => {
    try {
      const response: AxiosResponse<PaginatedResponse<Period> | Period[]> = await axios.get(`${BASE_URL}/api/periods/`)
      console.log('Raw Subjects API Response:', JSON.stringify(response.data, null, 2));
      let data: Period[];
      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (response.data && typeof response.data === 'object' && Array.isArray(response.data.results)) {
        data = response.data.results;
      } else {
        console.error('Invalid Periods response format:', JSON.stringify(response.data, null, 2));
        return [];
      }
      return data;
    } catch (error: any) {
      console.error('Fetch Periods Error:', JSON.stringify({
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      }, null, 2));
      return [];
    }
  };




export const createPeriods = async (data: { level: number; academicYear: string }): Promise<Period> => {
  try {
    const response = await axios.post(`${BASE_URL}/api/periods/`, data, {
      headers: { 'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '' },
    });
    console.log('Create Periods Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error: any) {
    console.error('Create Period Error:', JSON.stringify({
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    }, null, 2));
    throw error;
  }
};

export const deletePeriods = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/api/periods/${id}/`, {
      headers: { 'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '' },
    });
    console.log(`Deleted Period ID: ${id}`);
  } catch (error: any) {
    console.error('Delete Period Error:', JSON.stringify({
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    }, null, 2));
    throw error;
  }
};