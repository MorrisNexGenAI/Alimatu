import { useSelector, useDispatch,  } from 'react-redux';
import { fetchStudentsByLevel, addStudents } from '../slices/studentsSlice';
import type { RootState, AppDispatch } from '../store/index';
import type { Student } from '../types';

export const useStudents = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.students);
  const loadStudents = (levelId: string) => dispatch(fetchStudentsByLevel(levelId));
  const createStudent = (student: Omit<Student, 'id'>) => dispatch(addStudents(student));
  return { students: data as Student[], loading, error, loadStudents, createStudent };
};