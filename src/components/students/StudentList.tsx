import React from 'react';
import type { Student } from '../../types';

interface StudentListProps {
  students: Student[];
  error?: string;
}

const StudentList: React.FC<StudentListProps> = ({ students, error }) => {
  if (error || students.length === 0) {
    return <p className="text-center">{error || 'No students found for this level'}</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Students in Level</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">First Name</th>
            <th className="border p-2">Last Name</th>
            <th className="border p-2">Gender</th>
            <th className="border p-2">Date of Birth</th>
            <th className="border p-2">Level ID</th>
            <th className="border p-2">Academic Year</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="border">
              <td className="p-2">{student.firstName}</td>
              <td className="p-2">{student.lastName}</td>
              <td className="p-2">{student.gender}</td>
              <td className="p-2">{student.dob}</td>
              <td className="p-2 text-center">{student.level_id}</td>
              <td className="p-2">
        {typeof student.academic_year === 'object' && student.academic_year !== null
          ? student.academic_year.name
          : 'N/A'}
      </td>
            
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;