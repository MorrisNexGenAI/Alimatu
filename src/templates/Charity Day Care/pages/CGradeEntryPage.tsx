// C:\Users\USER\Desktop\GradeSheet\SchoolGradesSystem\src\pages\GradeEntryPage.tsx
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRefresh } from '../../../context/RefreshContext';
import { api } from '../../../api';
import { Level, Subject, Period, Student, GradeSheetEntry } from '../../../types';
import Select from '../../../components/common/Select';
import CharityTheme from '../charity';
import '../c_gradeentry.css'; // Import the new CSS file

const CGradeEntryPage: React.FC = () => {
  const { setRefresh } = useRefresh();
  const [levels, setLevels] = useState<Level[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [grades, setGrades] = useState<Record<number, number | null>>({});
  const [existingGrades, setExistingGrades] = useState<GradeSheetEntry[]>([]);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const data = await api.levels.getLevels();
        setLevels(data);
        console.log('Levels Data:', data);
      } catch (err) {
        toast.error('Failed to load levels');
      }
    };
    fetchLevels();
  }, []);

  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const data = await api.periods.getPeriods();
        setPeriods(data);
        console.log('Periods Data:', data);
      } catch (err) {
        toast.error('Failed to load periods');
      }
    };
    fetchPeriods();
  }, []);

  useEffect(() => {
    if (!selectedLevelId) {
      setStudents([]);
      setSubjects([]);
      setSelectedSubjectId(null);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const [studentsData, subjectsData] = await Promise.all([
          api.students.getStudentsByLevel(selectedLevelId),
          api.subjects.getSubjectsByLevel(selectedLevelId),
        ]);
        console.log('Students Data from API:', studentsData);
        console.log('Subjects Data from API:', subjectsData);
        setStudents(studentsData || []);
        setSubjects(subjectsData || []);
      } catch (err) {
        toast.error('Failed to load students or subjects');
        console.error('Fetch Error:', err);
        setStudents([]);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedLevelId]);

  useEffect(() => {
    console.log('Students State Updated:', students);
  }, [students]);

  useEffect(() => {
    console.log('Subjects State Updated:', subjects);
  }, [subjects]);

  const handleGradeChange = (studentId: number, value: string) => {
    const score = value === '' ? null : parseFloat(value);
    setGrades((prev) => ({ ...prev, [studentId]: score }));
  };

  const handleSubmit = async () => {
    if (!selectedSubjectId || !selectedPeriodId) {
      toast.error('Please select a subject and period');
      return;
    }
    if (!selectedLevelId) {
      toast.error('Level ID is required');
      return;
    }
    const gradeData = Object.entries(grades).map(([studentId, score]) => ({
      student_id: parseInt(studentId),
      subject_id: selectedSubjectId,
      period_id: selectedPeriodId,
      score: score || null,
      level_id: selectedLevelId, // Now guaranteed to be a number
    }));
    try {
      await api.grades.addGrade(gradeData,);
      toast.success('Grades submitted successfully');
      setGrades({});
      setRefresh((prev) => (prev === 0 ? 1 : 0));
    } catch (err) {
      toast.error('Failed to submit grades');
      console.error('Submit Error:', err);
    }
  };

  const handleCheckExistingGrade = async () => {
    if (!selectedLevelId || !selectedSubjectId || !selectedPeriodId) {
      toast.error('Please select a level, subject, and period');
      return;
    }
    setLoading(true);
    try {
      const data = await api.grade_sheets.getGradesByPeriodSubject(selectedLevelId, selectedSubjectId, selectedPeriodId);
      setExistingGrades(data);
      const initialGrades = data.reduce((acc, grade) => ({
        ...acc,
        [grade.student]: grade.score || null,
      }), {} as Record<number, number | null>);
      setGrades(initialGrades);
      if (data.length > 0) {
        toast.success('Existing grades loaded');
      } else {
        toast('No existing grades found');
      }
    } catch (err) {
      toast.error('Failed to load existing grades');
      console.error('Check Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGrades = async () => {
    if (!selectedSubjectId || !selectedPeriodId) {
      toast.error('Please select a subject and period');
      return;
    }
    const updateData = Object.entries(grades).map(([studentId, score]) => {
      const existingGrade = existingGrades.find(g => g.student === parseInt(studentId));
      return {
        id: existingGrade?.id,
        student_id: parseInt(studentId),
        subject_id: selectedSubjectId,
        period_id: selectedPeriodId,
        score: score || null,
      };
    }).filter(grade => grade.id);
    try {
      for (const grade of updateData) {
        await api.grades.updateGrade(grade.id!, { score: grade.score });
      }
      toast.success('Grades updated successfully');
      setExistingGrades([]);
      setGrades({});
      setRefresh((prev) => (prev === 0 ? 1 : 0));
    } catch (err) {
      toast.error('Failed to update grades');
      console.error('Update Error:', err);
    }
  };

  return (
    <CharityTheme>
      <div className="b-gradeentry-page p-4">
        <h1 className="b-gradeentry-heading">Grade Entry</h1>

        <Select
          label="Select Level"
          value={selectedLevelId?.toString() || ''}
          onChange={(e) => {
            const levelId = parseInt(e.target.value) || null;
            setSelectedLevelId(levelId);
            console.log('Selected Level ID:', levelId);
          }}
          options={[
            { value: '', label: 'Select a level' },
            ...levels.map((level) => ({
              value: level.id.toString(),
              label: level.name,
            })),
          ]}
        />

        {selectedLevelId && (
          <div className="b-select-group">
            <Select
              label="Select Student"
              value={''}
              disabled={true}
              options={[{ value: '', label: 'All Students' }]}
            />
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
            />
            <Select
              label="Select Period"
              value={selectedPeriodId?.toString() || ''}
              onChange={(e) => setSelectedPeriodId(parseInt(e.target.value) || null)}
              options={[
                { value: '', label: 'Select a period' },
                ...periods.map((period) => ({
                  value: period.id.toString(),
                  label: period.period,
                })),
              ]}
            />
            <button
              className="b-check-button"
              onClick={handleCheckExistingGrade}
              disabled={loading || !selectedLevelId || !selectedSubjectId || !selectedPeriodId}
            >
              Check Existing Grade
            </button>
          </div>
        )}

        {selectedLevelId && (
          students.length > 0 ? (
            <div className="b-gradeentry-table-container">
              <table className="w-full border-collapse mt-4">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Student Name</th>
                    <th className="border p-2">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border">
                      <td className="border p-2">{`${student.firstName} ${student.lastName}`}</td>
                      <td className="border p-2">
                        <input
                          type="number"
                          value={
                            grades[student.id] !== undefined && grades[student.id] !== null
                              ? grades[student.id]!
                              : ''
                          }
                          onChange={(e) => handleGradeChange(student.id, e.target.value)}
                          className="b-grade-input"
                          min="0"
                          max="100"
                          disabled={!selectedSubjectId || !selectedPeriodId}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="b-button-group">
                {existingGrades.length > 0 ? (
                  <button
                    className="b-update-button"
                    onClick={handleUpdateGrades}
                    disabled={loading || !selectedSubjectId || !selectedPeriodId}
                  >
                    Update Grade
                  </button>
                ) : (
                  <button
                    className="b-submit-button"
                    onClick={handleSubmit}
                    disabled={loading || !selectedSubjectId || !selectedPeriodId}
                  >
                    Submit Grade
                  </button>
                )}
                {existingGrades.length > 0 && (
                  <button
                    className="b-cancel-button"
                    onClick={() => {
                      setExistingGrades([]);
                      setGrades({});
                    }}
                  >
                    Cancel Update
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p className="b-gradeentry-message">No students available for this level.</p>
          )
        )}
      </div>
    </CharityTheme>
  );
};

export default CGradeEntryPage;