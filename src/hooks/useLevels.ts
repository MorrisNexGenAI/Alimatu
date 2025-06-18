import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api';
import type { Level } from '../types';

export const useLevels = () => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLevels = async () => {
      setLoading(true);
      setError(null);
      try {
        const levelData = await api.levels.getLevels();
        console.log('Raw Levels Response:', JSON.stringify(levelData, null, 2));
        setLevels(levelData);
        console.log('Processed Levels:', JSON.stringify(levelData, null, 2));
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to load levels';
        setError(errorMessage);
        console.error('Fetch Levels Error:', JSON.stringify({
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        }, null, 2));
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchLevels();
  }, []);

  return { levels, loading, error };
};