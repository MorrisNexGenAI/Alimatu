// features/students/StudentsPage.tsx
import React, { useEffect } from 'react';
import StudentForm from './StudentForm';
import StudentList from './StudentList';
import { useStudents } from '../../hooks/useStudents';

const StudentsPage: React.FC = () => {
  const { fetchStudents, addStudent } = useStudents();

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Students</h2>
      <StudentForm onSubmit={addStudent} />
      <StudentList />
    </div>
  );
};

export default StudentsPage;
