import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import type { Level } from '../types';

export const useLevels = () => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadLevels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.levels.getLevels();
      // Handle paginated response safely
      const data = (response && typeof response === 'object' && 'results' in response)
        ? (response as { results: Level[] }).results
        : response;
      setLevels(Array.isArray(data) ? data : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load levels';
      setError(message);
      setLevels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLevels();
  }, [loadLevels]);

  return { levels, loadLevels, loading, error };
};