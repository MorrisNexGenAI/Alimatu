import React from 'react';

type Student = {
  id: number;
  name: string;
  age: number;
  grade: string;
};

type Props = {
  student: Student;
  onDelete: (id: number) => void;
};

const StudentCard: React.FC<Props> = ({ student, onDelete }) => {
  return (
    <div className="p-4 border rounded shadow flex justify-between items-center">
      <div>
        <h3 className="font-bold text-lg">{student.name}</h3>
        <p>Age: {student.age}</p>
        <p>Grade: {student.grade}</p>
      </div>
      <button
        onClick={() => onDelete(student.id)}
        className="bg-red-500 text-white px-3 py-1 rounded"
      >
        Delete
      </button>
    </div>
  );
};

export default StudentCard;
