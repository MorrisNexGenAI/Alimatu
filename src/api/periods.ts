import axios from 'axios';
import { BASE_URL } from './config';
import type { Period, PaginatedResponse } from '../types';

export const getPeriods = async (token: string): Promise<Period[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/periods/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Raw Periods API Response:', JSON.stringify(response.data, null, 2));
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

export const createPeriod = async (data: { period: string }, token: string): Promise<Period> => {
  try {
    const response = await axios.post(`${BASE_URL}/api/periods/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '',
      },
    });
    console.log('Create Period Response:', JSON.stringify(response.data, null, 2));
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

export const updatePeriod = async (id: number, data: { period: string }, token: string): Promise<Period> => {
  try {
    const response = await axios.put(`${BASE_URL}/api/periods/${id}/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '',
      },
    });
    console.log('Update Period Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error: any) {
    console.error('Update Period Error:', JSON.stringify({
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    }, null, 2));
    throw error;
  }
};

export const deletePeriod = async (id: number, token: string): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/api/periods/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '',
      },
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