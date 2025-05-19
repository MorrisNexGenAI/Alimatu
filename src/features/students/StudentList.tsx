import React from 'react';
import { useStudents } from '../../hooks/useStudents';

const StudentList: React.FC = () => {
  const { students, deleteStudent, loading, error } = useStudents();

  if (loading) return <p>Loading students...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  if (!Array.isArray(students)) {
    return <p>Invalid data: students is not an array.</p>; // Debugging help
  }

  return (
    <div className="space-y-2">
      {students.map((student) => (
        <div key={student.id} className="p-4 border rounded flex justify-between items-center">
          <div>
            <p className="font-bold">{student.firstName} {student.lastName}</p>
            <p>Gender: {student.gender} | DOB: {student.dob}</p>
          </div>
          <button
            onClick={() => deleteStudent(student.id)}
            className="btn-red"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default StudentList;
