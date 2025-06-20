import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRefresh } from '../context/RefreshContext';
import { api } from '../api';
import { Subject, Period, Student, GradeSheetEntry, AcademicYear } from '../types';
import Select from '../components/common/Select';
import './b_gradeentry.css';

interface StudentGradeEntryModalProps {
  student: Student;
  subjects: Subject[];
  periods: Period[];
  academicYear: AcademicYear | null;
  levelId: number | null;
  onClose: () => void;
}

const StudentGradeEntryModal: React.FC<StudentGradeEntryModalProps> = ({
  student,
  subjects,
  periods,
  academicYear,
  levelId,
  onClose,
}) => {
  const { setRefresh } = useRefresh();
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [grades, setGrades] = useState<Record<number, number | null>>({});
  const [existingGrades, setExistingGrades] = useState<GradeSheetEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedSubjectId || !academicYear || !levelId) {
      setExistingGrades([]);
      setGrades({});
      return;
    }
    const fetchExistingGrades = async () => {
      setLoading(true);
      try {
        const result = await api.grade_sheets.getGradesByPeriodSubject(
          levelId,
          selectedSubjectId,
          null,
          academicYear.name
        );
        const data = Array.isArray(result) ? result : [];
        const studentGrades = data.filter((grade: any) => grade.student_id === student.id);
        setExistingGrades(studentGrades);
        const initialGrades = studentGrades.reduce(
          (acc, grade: GradeSheetEntry) => ({
            ...acc,
            [grade.period_id!]: grade.score || null,
          }),
          {} as Record<number, number | null>
        );
        setGrades(initialGrades);
        if (studentGrades.length > 0) {
          toast.success('Existing grades loaded');
        } else {
          toast('No existing grades found for this subject');
        }
      } catch (err) {
        toast.error('Failed to load existing grades');
        console.error('Fetch Existing Grades Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExistingGrades();
  }, [selectedSubjectId, academicYear, levelId, student.id]);

  const handleGradeChange = (periodId: number, value: string) => {
    const score = value === '' ? null : parseFloat(value);
    setGrades((prev) => ({ ...prev, [periodId]: score }));
  };

  const handleSubmit = async () => {
    if (!selectedSubjectId || !academicYear || !levelId) {
      toast.error('Please select a subject');
      return;
    }
    const gradeData = {
      level: levelId,
      subject_id: selectedSubjectId,
      academic_year: academicYear.name,
      grades: Object.entries(grades)
        .filter(([_, score]) => score !== null)
        .map(([periodId, score]) => ({
          student_id: student.id,
          score: score!,
          period_id: parseInt(periodId),
        })),
    };
    console.log('Submitting grades:', gradeData);
    try {
      const response = await api.grade_sheets.postGrades(gradeData);
      console.log('Grade submission response:', response);
      toast.success('Grades submitted successfully');
      setGrades({});
      setExistingGrades([]);
      setRefresh((prev) => prev + 1);
      onClose();
    } catch (err: any) {
      console.error('Submit Error:', err);
      toast.error('Failed to submit grades');
      if (err.response) {
        console.error('Response Error:', err.response.status, err.response.data);
      }
    }
  };

  return (
    <div className="b-modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="b-modal-content bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="b-modal-heading text-xl font-bold mb-4">
          Enter Grades for {student.firstName} {student.lastName}
        </h2>
        <div className="mb-4">
          <Select
            label="Select Subject"
            value={selectedSubjectId?.toString() || ''}
            onChange={(e) => setSelectedSubjectId(parseInt(e.target.value) || null)}
            options={[
              { value: '', label: 'Select a subject' },
              ...subjects.map((subject) => ({
                value: subject.id.toString(),
                label: subject.subject,
              })),
            ]}
            disabled={loading}
          />
        </div>
        {selectedSubjectId && (
          <div className="b-gradeentry-table-container">
            <table className="w-full border-collapse mt-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Period</th>
                  <th className="border p-2">Grade</th>
                </tr>
              </thead>
              <tbody>
                {periods.map((period) => (
                  <tr key={period.id} className="border">
                    <td className="border p-2">{period.period}</td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={
                          grades[period.id] !== undefined && grades[period.id] !== null
                            ? grades[period.id]!
                            : ''
                        }
                        onChange={(e) => handleGradeChange(period.id, e.target.value)}
                        className="b-grade-input w-full p-1 border rounded"
                        min="0"
                        max="100"
                        disabled={loading}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="b-button-group mt-4 flex justify-end">
          <button
            className="b-cancel-button p-2 bg-red-500 text-white rounded mr-2"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="b-submit-button p-2 bg-blue-500 text-white rounded"
            onClick={handleSubmit}
            disabled={loading || !selectedSubjectId}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentGradeEntryModal;