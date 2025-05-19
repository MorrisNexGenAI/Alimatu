import React from 'react';

type Student = {
  id: number;
  first_name:string;
  last_name:string;
  gender:string;
  dob:string;
};

type Props = {
  student: Student;
  onDelete: (id: number) => void;
};

const StudentCard: React.FC<Props> = ({ student, onDelete }) => {
  return (
    <div className="p-4 border rounded shadow flex justify-between items-center">
      <div>
        <h3 className="font-bold text-lg">{student.first_name}</h3>
          <h3 className="font-bold text-lg">{student.last_name}</h3>
        <p>Gender: {student.gender}</p>
        <p>Date of Birth: {student.dob}</p>
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
