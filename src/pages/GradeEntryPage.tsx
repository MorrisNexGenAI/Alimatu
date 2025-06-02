import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRefresh } from '../context/RefreshContext';
import { getLevels, getStudentsByLevel, getSubjectsByLevel, getPeriods, postGrades } from '../api/api';

interface Level { id: number; name: string; }
interface Student { id: number; firstName: string; lastName: string; }
interface Subject { id: number; subject: string; }
interface Period { id: number; period: string; }

const GradeEntryPage: React.FC = () => {                                HIGH   
  const { setRefresh } = useRefresh();
  const [levels, setLevels] = useState<Level[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState<number | null>(null);
  const [grades, setGrades] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(false);

  // Fetch levels on mount
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const data = await getLevels();
        setLevels(data);
      } catch (err) {
        toast.error('Failed to load levels');
      }
    };
    fetchLevels();
  }, []);

  // Fetch students and subjects when level changes
  useEffect(() => {
    if (!selectedLevelId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [studentsData, subjectsData] = await Promise.all([
          getStudentsByLevel(selectedLevelId),
          getSubjectsByLevel(selectedLevelId),
        ]);
        setStudents(studentsData);
        console.log('Subjects Data:', subjectsData); // Debug log
        const uniqueSubjects = Array.from(
          new Map(subjectsData.map(s => [s.id, s])).values()
        );
        console.log('Unique Subjects:', uniqueSubjects); // Debug log
        setSubjects(uniqueSubjects);
        setGrades({});
      } catch (err) {
        console.error('Error fetching students or subjects:', err); // Debug error
        toast.error('Failed to load students or subjects');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedLevelId]);

  // Fetch periods on mount
  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const data = await getPeriods();
        setPeriods(data);
      } catch (err) {
        toast.error('Failed to load periods');
      }
    };
    fetchPeriods();
  }, []);

  // Handle grade input changes
  const handleGradeChange = (studentId: number, value: string) => {
    const score = parseFloat(value);
    setGrades(prev => ({
      ...prev,
      [studentId]: isNaN(score) ? 0 : score,
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedLevelId || !selectedSubjectId || !selectedPeriodId) {
      toast.error('Please select level, subject, and period');
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
      await postGrades({
        level: selectedLevelId,
        subject_id: selectedSubjectId,
        period_id: selectedPeriodId,
        grades: gradesToSubmit,
      });
      toast.success('Grades submitted successfully');
      setGrades({});
      setRefresh(prev => (prev === 0 ? 1 : 0));
    } catch (err) {
      toast.error('Failed to submit grades');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Grade Entry</h1>

      <div className="mb-4">
        <label className="block mb-1">Select Level</label>
        <select
          className="border p-2 rounded w-full"
          value={selectedLevelId || ''}
          onChange={(e) => setSelectedLevelId(parseInt(e.target.value) || null)}
        >
          <option value="">Select a level</option>
          {levels.map((level) => (
            <option key={level.id} value={level.id}>{level.name}</option>
          ))}
        </select>
      </div>

      {selectedLevelId && (
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block mb-1">Select Subject</label>
            <select
              className="border p-2 rounded w-full"
              value={selectedSubjectId || ''}
              onChange={(e) => setSelectedSubjectId(parseInt(e.target.value) || null)}
            >
              <option value="">Select a subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>{subject.subject}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-1">Select Period</label>
            <select
              className="border p-2 rounded w-full"
              value={selectedPeriodId || ''}
              onChange={(e) => setSelectedPeriodId(parseInt(e.target.value) || null)}
            >
              <option value="">Select a period</option>
              {periods.map((period) => (
                <option key={period.id} value={period.id}>{period.period}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {selectedLevelId && students.length > 0 && (
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
                    />
                  </td>
                  <td className="p-2">{`${student.firstName} ${student.lastName}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedLevelId && students.length > 0 && (
        <button
          className={`bg-blue-500 text-white p-2 rounded ${loading ? 'opacity-50' : ''}`}
          onClick={handleSubmit}
          disabled={loading || !selectedSubjectId || !selectedPeriodId}
        >
          {loading ? 'Submitting...' : 'Submit Grades'}
        </button>
      )}
    </div>
  );
};

export default GradeEntryPage;