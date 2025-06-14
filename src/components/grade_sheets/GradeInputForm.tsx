import React, { useState } from 'react';
import toast from 'react-hot-toast';
import type { Student } from '../../types';
import { api } from '../../api';

interface GradeInputFormProps {
  students: Student[];
  levelId: number;
  subjectId: number | null;
  periodId: number | null;
  onSubmit: () => void;
}

const GradeInputForm: React.FC<GradeInputFormProps> = ({
  students,
  levelId,
  subjectId,
  periodId,
  onSubmit,
}) => {
  const [grades, setGrades] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(false);

  const handleGradeChange = (studentId: number, value: string) => {
    const score = parseFloat(value);
    setGrades((prev) => ({
      ...prev,
      [studentId]: isNaN(score) ? 0 : score,
    }));
  };

  const handleSubmit = async () => {
    if (!subjectId || !periodId) {
      toast.error('Please select subject and period');
      return;
    }

    const gradesToSubmit = Object.entries(grades)
      .filter(([_, score]) => score > 0)
      .map(([studentId, score]) => ({
        student_id: parseInt(studentId),
        score,
      }));

    if (gradesToSubmit.length === 0) {
      toast.error('Please enter at least one grade');
      return;
    }

    setLoading(true);
    try {
      await api.grade_sheets.postGrades({
        level: levelId,
        subject_id: subjectId,
        period_id: periodId,
        grades: gradesToSubmit,
        academic_year: ''
      });
      toast.success('Grades submitted successfully');
      setGrades({});
      onSubmit();
    } catch (err) {
      toast.error('Failed to submit grades');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl mb-2">Enter Grades</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Grade</th>
            <th className="border p-2">Student</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="border">
              <td className="p-2">
                <input
                  type="number"
                  className="border p-1 rounded w-20"
                  value={grades[student.id] || ''}
                  onChange={(e) => handleGradeChange(student.id, e.target.value)}
                  min="0"
                  max="100"
                  disabled={loading}
                />
              </td>
              <td className="p-2">{`${student.firstName} ${student.lastName}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className={`bg-blue-500 text-white p-2 rounded mt-4 ${loading ? 'opacity-50' : ''}`}
        onClick={handleSubmit}
        disabled={loading || !subjectId || !periodId}
      >
        {loading ? 'Submitting...' : 'Submit Grades'}
      </button>
    </div>
  );
};

export default GradeInputForm;