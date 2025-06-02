import { useState, useCallback } from 'react';
import { api } from '../api';
import type { Subject } from '../types';

export const useSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSubjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.subjects.getSubjects();
      setSubjects(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load subjects';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { subjects, loadSubjects, loading, error };
};