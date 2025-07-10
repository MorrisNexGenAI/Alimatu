import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getPeriods, createPeriod, updatePeriod, deletePeriod } from '../api/periods';
import type { Period } from '../types/index';

export const usePeriods = (token: string) => {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPeriods = async () => {
    setLoading(true);
    try {
      const data = await getPeriods(token);
      setPeriods(data);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to load periods';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchPeriods();
  }, [token]);

  const addPeriod = async (data: { period: string }) => {
    setLoading(true);
    try {
      const newPeriod = await createPeriod(data, token);
      setPeriods([...periods, newPeriod]);
      toast.success('Period created');
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create period';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const editPeriod = async (id: number, data: { period: string }) => {
    setLoading(true);
    try {
      const updatedPeriod = await updatePeriod(id, data, token);
      setPeriods(periods.map(p => (p.id === id ? updatedPeriod : p)));
      toast.success('Period updated');
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update period';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const removePeriod = async (id: number) => {
    setLoading(true);
    try {
      await deletePeriod(id, token);
      setPeriods(periods.filter(p => p.id !== id));
      toast.success('Period deleted');
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete period';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { periods, loading, error, fetchPeriods, addPeriod, editPeriod, removePeriod };
};