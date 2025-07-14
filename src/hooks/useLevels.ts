// hooks/useLevels.ts
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiClient } from '../api/apiClient';
import type { Level } from '../types';

export const useLevels = () => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLevels = async () => {
    setLoading(true);
    try {
      const data = await apiClient.levels.getLevels();
      setLevels(data);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to load levels';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  const addLevel = async (data: { name: string }) => {
    setLoading(true);
    try {
      const newLevel = await apiClient.levels.createLevel(data);
      setLevels([...levels, newLevel]);
      toast.success('Level created');
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create level';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const editLevel = async (id: number, data: { name: string }) => {
    setLoading(true);
    try {
      const updatedLevel = await apiClient.levels.updateLevel(id, data);
      setLevels(levels.map((l) => (l.id === id ? updatedLevel : l)));
      toast.success('Level updated');
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update level';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const removeLevel = async (id: number) => {
    setLoading(true);
    try {
      await apiClient.levels.deleteLevel(id);
      setLevels(levels.filter((l) => l.id !== id));
      toast.success('Level deleted');
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete level';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { levels, loading, error, fetchLevels, addLevel, editLevel, removeLevel };
};