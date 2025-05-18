import React from 'react';
import useStudents from '../../hooks/useStudents';
import StudentCard from '../../components/ui/StudentCard';

const StudentList: React.FC = () => {
  const { students, deleteStudent } = useStudents();

  return (
    <div className="grid gap-4">
      {students.map((student) => (
        <StudentCard key={student.id} student={student} onDelete={deleteStudent} />
      ))}
    </div>
  );
};

export default StudentList;
