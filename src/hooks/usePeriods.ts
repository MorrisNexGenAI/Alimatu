import { useState, useCallback } from 'react';
import { api } from '../api';
import type { Period } from '../types';

export const usePeriods = () => {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPeriods = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.periods.getPeriods();
      setPeriods(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load periods';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { periods, loadPeriods, loading, error };
};