// hooks/useStudents.ts

import { useAppDispatch, useAppSelector } from '../store/hooks'; // ✅ Correct
// Update the path if your hooks file is in 'src/hooks/index.ts' or adjust to the correct relative path
import {
  fetchStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} from '../features/students/studentSlice';

export const useStudents = () => {
  const dispatch = useAppDispatch();
  const { students, loading, error } = useAppSelector((state: any) => state.students);

  return {
    students,
    loading,
    error,
    fetchStudents: () => dispatch(fetchStudents()),
    addStudent: (data: any) => dispatch(addStudent(data)),
    updateStudent: (data: any) => dispatch(updateStudent(data)),
    deleteStudent: (id: number) => dispatch(deleteStudent(id)),
  };
};
