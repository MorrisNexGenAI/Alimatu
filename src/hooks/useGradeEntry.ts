import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRefresh } from '../context/RefreshContext';
import { api } from '../api';
import type { Level, AcademicYear, Period, Student, Subject, GradeSheetEntry } from '../types';

export const useGradeEntry = () => {
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
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

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

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subjectId = parseInt(e.target.value) || null;
    setSelectedSubjectId(subjectId);
    console.log('Selected Subject ID:', subjectId);
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const periodId = parseInt(e.target.value) || null;
    setSelectedPeriodId(periodId);
    console.log('Selected Period ID:', periodId);
  };

  const handleGradeChange = (studentId: number, value: string) => {
    const score = value === '' ? null : parseFloat(value);
    setGrades((prev) => ({ ...prev, [studentId]: score }));
  };

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleCloseModal = () => {
    setSelectedStudent(null);
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

  const handleCancelUpdate = () => {
    setExistingGrades([]);
    setGrades({});
  };

  return {
    levels,
    academicYears,
    selectedLevelId,
    selectedAcademicYearId,
    students,
    subjects,
    selectedSubjectId,
    periods,
    selectedPeriodId,
    loading,
    grades,
    existingGrades,
    selectedStudent,
    handleLevelChange,
    handleAcademicYearChange,
    handleSubjectChange,
    handlePeriodChange,
    handleGradeChange,
    handleStudentClick,
    handleCloseModal,
    handleSubmit,
    handleCheckExistingGrade,
    handleUpdateGrades,
    handleCancelUpdate,
  };
};