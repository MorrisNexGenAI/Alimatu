import { useState, useCallback } from 'react';
import { apiClient } from '../api/apiClient';
import type { GradeSheet } from '../types/index';

export const useGrades = () => {
  const [gradesheets, setGradesheets] = useState<GradeSheet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGrades = useCallback(async (levelId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.grades.getGradesByLevel(Number(levelId));
      if (Array.isArray(data)) {
        setGradesheets(data);
      } else {
        setGradesheets([]);
        setError('No grades data returned');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load grades';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { gradesheets, loadGrades, loading, error };
};