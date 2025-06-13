import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useGrades } from './useGrades';
import { useSubjects } from './useSubjects';
import { usePeriods } from './usePeriods';

export const useGradeView = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const { gradesheets, loadGrades, loading: gradesLoading, error: gradesError } = useGrades();
  const { subjects, loadSubjects, loading: subjectsLoading, error: subjectsError } = useSubjects();
  const { periods, loadPeriods, loading: periodsLoading, error: periodsError } = usePeriods();

  useEffect(() => {
    if (levelId) {
      loadGrades(levelId);
    }
    loadSubjects();
    loadPeriods();
  }, [levelId, loadGrades, loadSubjects, loadPeriods]);

  useEffect(() => {
    if (gradesError) toast.error(gradesError);
    if (subjectsError) toast.error(subjectsError);
    if (periodsError) toast.error(periodsError);
  }, [gradesError, subjectsError, periodsError]);

  const loading = gradesLoading || subjectsLoading || periodsLoading;

  return {
    gradesheets,
    subjects,
    periods,
    loading,
  };
};