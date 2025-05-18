import React from 'react';
import StudentForm from './StudentForm';
import StudentList from './StudentList';

const StudentsPage: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Students</h2>
      <StudentForm />
      <StudentList />
    </div>
  );
};

export default StudentsPage;

  