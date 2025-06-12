import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRefresh } from '../context/RefreshContext';
import { api } from '../api';
import { Level, Subject, Period, Student, GradeSheetEntry, AcademicYear } from '../types';
import Select from '../components/common/Select';
import BomiTheme from '../templates/Bomi junior High/bomi';
import './b_gradeentry.css';

const GradeEntryPage: React.FC = () => {
  const { setRefresh } = useRefresh();
  const [levels, setLevels] = useState<Level[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [grades, setGrades] = useState<Record<number, number | null>>({});
  const [existingGrades, setExistingGrades] = useState<GradeSheetEntry[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [levelData, academicYearData, periodData] = await Promise.all([
          api.levels.getLevels(),
          api.academic_years.getAcademicYears(),
          api.periods.getPeriods(),
        ]);
        setLevels(levelData);
        setAcademicYears(academicYearData);
        setPeriods(periodData);
        const currentYear = academicYearData.find((year) => year.name === '2025/2026');
        setSelectedAcademicYearId(currentYear?.id || (academicYearData.length > 0 ? academicYearData[0].id : null));
        console.log('Levels:', levelData, 'Academic Years:', academicYearData, 'Periods:', periodData);
      } catch (err) {
        toast.error('Failed to load initial data');
        console.error('Initial Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!selectedLevelId || !selectedAcademicYearId) {
      setStudents([]);
      setSubjects([]);
      setSelectedSubjectId(null);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const academicYear = academicYears.find((ay) => ay.id === selectedAcademicYearId)?.name;
        if (!academicYear) throw new Error('Invalid academic year selected');
        const [studentsData, subjectsData] = await Promise.all([
          api.students.getStudentsByLevel(selectedLevelId, academicYear),
          api.subjects.getSubjectsByLevel(selectedLevelId),
        ]);
        const filteredStudents = studentsData.filter(
          (student) => !(student.firstName === 'Test' && student.lastName === 'Student')
        );
        setStudents(filteredStudents || []);
        setSubjects(subjectsData || []);
        console.log('Students:', filteredStudents, 'Subjects:', subjectsData);
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
  }, [selectedLevelId, selectedAcademicYearId, academicYears]);

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const levelId = parseInt(e.target.value) || null;
    setSelectedLevelId(levelId);
    setGrades({});
    setExistingGrades([]);
    console.log('Selected Level ID:', levelId);
  };

  const handleAcademicYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const academicYearId = parseInt(e.target.value) || null;
    setSelectedAcademicYearId(academicYearId);
    setGrades({});
    setExistingGrades([]);
    console.log('Selected Academic Year ID:', academicYearId);
  };

  const handleGradeChange = (studentId: number, value: string) => {
    const score = value === '' ? null : parseFloat(value);
    setGrades((prev) => ({ ...prev, [studentId]: score }));
  };

  const handleSubmit = async () => {
    if (!selectedSubjectId || !selectedPeriodId || !selectedLevelId || !selectedAcademicYearId) {
      toast.error('Please select a level, academic year, subject, and period');
      return;
    }
    const academicYear = academicYears.find((ay) => ay.id === selectedAcademicYearId)?.name;
    if (!academicYear) {
      toast.error('Invalid academic year selected');
      return;
    }
    const gradeData = {
      level: selectedLevelId,
      subject_id: selectedSubjectId,
      period_id: selectedPeriodId,
      academic_year: academicYear,
      grades: Object.entries(grades)
        .filter(([_, score]) => score !== null)
        .map(([studentId, score]) => ({
          student_id: parseInt(studentId),
          score: score!,
        })),
    };
    try {
      await api.grade_sheets.postGrades(gradeData);
      toast.success('Grades submitted successfully');
      setGrades({});
      setExistingGrades([]);
      setRefresh((prev) => prev + 1);
    } catch (err) {
      toast.error('Failed to submit grades');
      console.error('Submit Error:', err);
    }
  };

  const handleCheckExistingGrade = async () => {
    if (!selectedLevelId || !selectedSubjectId || !selectedPeriodId || !selectedAcademicYearId) {
      toast.error('Please select a level, academic year, subject, and period');
      return;
    }
    const academicYear = academicYears.find((ay) => ay.id === selectedAcademicYearId)?.name;
    if (!academicYear) {
      toast.error('Invalid academic year selected');
      return;
    }
    setLoading(true);
    try {
      const data = await api.grade_sheets.getGradesByPeriodSubject(
        selectedLevelId,
        selectedSubjectId,
        selectedPeriodId,
        academicYear
      );
      setExistingGrades(data);
      const initialGrades = data.reduce(
        (acc, grade) => ({
          ...acc,
          [grade.student_id]: grade.score || null,
        }),
        {} as Record<number, number | null>
      );
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
    if (!selectedSubjectId || !selectedPeriodId || !selectedLevelId || !selectedAcademicYearId) {
      toast.error('Please select a level, academic year, subject, and period');
      return;
    }
    const academicYear = academicYears.find((ay) => ay.id === selectedAcademicYearId)?.name;
    if (!academicYear) {
      toast.error('Invalid academic year selected');
      return;
    }
    const updateData = {
      level: selectedLevelId,
      subject_id: selectedSubjectId,
      period_id: selectedPeriodId,
      academic_year: academicYear,
      grades: Object.entries(grades)
        .filter(([_, score]) => score !== null)
        .map(([studentId, score]) => ({
          student_id: parseInt(studentId),
          score: score!,
        })),
    };
    try {
      await api.grade_sheets.postGrades(updateData); // Use postGrades for updates (backend handles duplicates)
      toast.success('Grades updated successfully');
      setExistingGrades([]);
      setGrades({});
      setRefresh((prev) => prev + 1);
    } catch (err) {
      toast.error('Failed to update grades');
      console.error('Update Error:', err);
    }
  };

  return (
    <BomiTheme>
      <div className="b-gradeentry-page p-4">
        <h1 className="b-gradeentry-heading">Grade Entry</h1>

        <div className="grid gap-4 sm:grid-cols-2 mb-4">
          <Select
            label="Select Level"
            value={selectedLevelId?.toString() || ''}
            onChange={handleLevelChange}
            options={[
              { value: '', label: 'Select a level' },
              ...levels.map((level) => ({
                value: level.id.toString(),
                label: level.name,
              })),
            ]}
            disabled={loading}
          />
          <Select
            label="Select Academic Year"
            value={selectedAcademicYearId?.toString() || ''}
            onChange={handleAcademicYearChange}
            options={[
              { value: '', label: 'Select an academic year' },
              ...academicYears.map((year) => ({
                value: year.id.toString(),
                label: year.name,
              })),
            ]}
            disabled={loading}
          />
        </div>

        {selectedLevelId && selectedAcademicYearId && (
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
              disabled={loading}
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
              disabled={loading}
            />
            <button
              className="b-check-button p-2 bg-blue-500 text-white rounded"
              onClick={handleCheckExistingGrade}
              disabled={loading || !selectedLevelId || !selectedAcademicYearId || !selectedSubjectId || !selectedPeriodId}
            >
              Check Existing Grade
            </button>
          </div>
        )}

        {selectedLevelId && selectedAcademicYearId && (
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
                          className="b-grade-input w-full p-1 border rounded"
                          min="0"
                          max="100"
                          disabled={loading || !selectedSubjectId || !selectedPeriodId}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="b-button-group mt-4">
                {existingGrades.length > 0 ? (
                  <button
                    className="b-update-button p-2 bg-green-500 text-white rounded"
                    onClick={handleUpdateGrades}
                    disabled={loading || !selectedSubjectId || !selectedPeriodId}
                  >
                    Update Grade
                  </button>
                ) : (
                  <button
                    className="b-submit-button p-2 bg-blue-500 text-white rounded"
                    onClick={handleSubmit}
                    disabled={loading || !selectedSubjectId || !selectedPeriodId}
                  >
                    Submit Grade
                  </button>
                )}
                {existingGrades.length > 0 && (
                  <button
                    className="b-cancel-button p-2 bg-red-500 text-white rounded ml-2"
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
            <p className="b-gradeentry-message mt-4">
              {loading ? 'Loading students...' : 'No students available for this level and academic year.'}
            </p>
          )
        )}
      </div>
    </BomiTheme>
  );
};

export default GradeEntryPage;
