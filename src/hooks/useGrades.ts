import { useSelector, useDispatch } from 'react-redux';
import { fetchGradesheetsByStudent, createGrade } from '../slices/gradesheetSlice';
import type { RootState, AppDispatch } from '../store/index';
import type { Gradesheet } from '../types';

export const useGrades = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.gradesheets);
  const loadGrades = (studentId: string) => dispatch(fetchGradesheetsByStudent(studentId));
  const addGrades = (grade: Omit<Gradesheet, 'id'>) => dispatch(createGrade(grade));
  return { gradesheets: data as Gradesheet[], loading, error, loadGrades, addGrades };
};