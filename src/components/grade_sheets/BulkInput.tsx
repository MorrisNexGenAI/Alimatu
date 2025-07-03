import React, { useState } from 'react';
import toast from 'react-hot-toast';
import type { Student, Subject, Period } from '../../types';
import { gradesApi } from '../../api/grades';
import Select from '../common/Select';
import Modal from '../common/Modal';

interface BulkInputProps {
  student: Student;
  levelId: number;
  academicYearId: number;
  subjects: Subject[];
  periods: Period[];
  onClose: () => void;
  onSubmit: () => void;
}

const BulkInput: React.FC<BulkInputProps> = ({
  student,
  levelId,
  academicYearId,
  subjects,
  periods,
  onClose,
  onSubmit,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [grades, setGrades] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(false);

  const handleGradeChange = (periodId: number, value: string) => {
    const score = parseFloat(value);
    setGrades((prev) => ({
      ...prev,
      [periodId]: isNaN(score) ? 0 : score,
    }));
  };

  const handleSubmit = async () => {
    console.log('handleSubmit triggered', { selectedSubjectId, academicYearId, grades, levelId, studentId: student.id });

    if (!selectedSubjectId || !academicYearId) {
      toast.error('Please select a subject and ensure academic year is set');
      console.log('Validation failed: missing subject or academic year');
      return;
    }

    const gradesToSubmit = Object.entries(grades)
      .filter(([_, score]) => score > 0)
      .map(([periodId, score]) => ({
        student_id: student.id,
        score,
        period_id: parseInt(periodId),
      }));

    if (gradesToSubmit.length === 0) {
      toast.error('Please enter at least one grade');
      console.log('Validation failed: no valid grades');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        level: levelId,
        subject_id: parseInt(selectedSubjectId),
        period_id: gradesToSubmit[0].period_id,
        grades: gradesToSubmit,
        academic_year: academicYearId,
      };
      console.log('Sending payload to API:', payload);
      const response = await gradesApi.postGrades(payload);
      console.log('API response:', response);
      toast.success('Grades submitted successfully');
      setGrades({});
      setSelectedSubjectId('');
      onSubmit();
      onClose();
    } catch (err: any) {
      console.error('API error:', err.message, err.response?.data);
      toast.error(`Failed to submit grades: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const subjectOptions = [
    { value: '', label: 'Select a subject' },
    ...subjects.map((subject) => ({
      value: subject.id.toString(),
      label: subject.subject,
    })),
  ];

  return (
    <Modal onClose={onClose}>
      <div className="p-4 max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-medium mb-4">Bulk Grade Input for {student.firstName} {student.lastName}</h2>
        <Select
          label="Select Subject"
          value={selectedSubjectId}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedSubjectId(e.target.value)}
          options={subjectOptions}
          disabled={loading}
        />
        <div className="mt-4">
          <h3 className="text-base font-medium mb-2">Enter Grades by Period</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2 text-left text-sm">Period</th>
                <th className="border p-2 text-left text-sm">Grade (0-100)</th>
              </tr>
            </thead>
            <tbody>
              {periods.map((period) => (
                <tr key={period.id} className="border">
                  <td className="p-2 text-sm">{period.period}</td>
                  <td className="p-2">
                    <input
                      type="number"
                      className="border p-1 rounded w-full text-sm"
                      value={grades[period.id] || ''}
                      onChange={(e) => handleGradeChange(period.id, e.target.value)}
                      min="0"
                      max="100"
                      disabled={loading || !selectedSubjectId}
                      aria-label={`Grade for ${period.period}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="bg-gray-300 text-black p-2 rounded text-sm"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={`bg-blue-500 text-white p-2 rounded text-sm ${loading ? 'opacity-50' : ''}`}
            onClick={() => {
              console.log('Submit button clicked');
              handleSubmit();
            }}
            disabled={loading || !selectedSubjectId}
          >
            {loading ? 'Submitting...' : 'Submit Grades'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BulkInput;