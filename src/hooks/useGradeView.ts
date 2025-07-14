import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useGrades } from './useGrades';
import { usePeriods } from './usePeriods';

export const useGradeView = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const { gradesheets, loadGrades, loading: gradesLoading, error: gradesError } = useGrades();
  const { periods, fetchPeriods, loading: periodsLoading, error: periodsError } = usePeriods();

  useEffect(() => {
    if (levelId) {
      loadGrades(levelId);
    }
    fetchPeriods();
  }, [levelId, loadGrades, fetchPeriods]);

  useEffect(() => {
    if (gradesError) toast.error(gradesError);
    if (periodsError) toast.error(periodsError);
  }, [gradesError, periodsError]);

  const loading = gradesLoading ||  periodsLoading;

  return {
    gradesheets,
    periods,
    loading,
  };
};