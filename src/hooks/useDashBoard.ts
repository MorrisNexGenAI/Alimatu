import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api';

interface DashboardMetrics {
  totalStudents: number;
  recentGrades: number;
}

export const useDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({ totalStudents: 0, recentGrades: 0 });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulated API calls for metrics
        const [studentCount, gradeCount] = await Promise.all([
          api.students.getStudents(),
          api.grade_sheets.getRecentGradesCount(),
        ]);
        setMetrics({
          totalStudents: studentCount.length || 50, // Fallback to static data if API fails
          recentGrades: gradeCount.count || 10,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load dashboard metrics';
        toast.error(message);
        setError(message);
        // Fallback to static data on error
        setMetrics({ totalStudents: 50, recentGrades: 10 });
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  return {
    metrics,
    loading,
    error,
  };
};