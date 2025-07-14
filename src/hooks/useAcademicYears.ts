import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiClient } from '../api/apiClient';
import type { AcademicYear } from '../types/index';

export const useAcademicYears = () => {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAcademicYears = async () => {
    setLoading(true);
    try {
      const data = await apiClient.academicYears.getAcademicYears();
      setAcademicYears(data);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to load academic years';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  const addAcademicYear = async (data: { name: string; start_date: string; end_date: string }) => {
    setLoading(true);
    try {
      const newYear = await apiClient.academicYears.createAcademicYear(data);
      setAcademicYears([...academicYears, newYear]);
      toast.success('Academic year created');
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create academic year';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const editAcademicYear = async (id: number, data: { name: string; start_date: string; end_date: string }) => {
    setLoading(true);
    try {
      const updatedYear = await apiClient.academicYears.updateAcademicYear(id, data);
      setAcademicYears(academicYears.map(y => (y.id === id ? updatedYear : y)));
      toast.success('Academic year updated');
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update academic year';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const removeAcademicYear = async (id: number) => {
    setLoading(true);
    try {
      await apiClient.academicYears.delAcademicYear(id);
      setAcademicYears(academicYears.filter(y => y.id !== id));
      toast.success('Academic year deleted');
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete academic year';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { academicYears, loading, error, fetchAcademicYears, addAcademicYear, editAcademicYear, removeAcademicYear };
};