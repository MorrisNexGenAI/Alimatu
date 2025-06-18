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
        console.log('Raw Levels Response:', JSON.stringify(levelData, null, 2));
        console.log('Raw Academic Years Response:', JSON.stringify(academicYearData, null, 2));
        console.log('Raw Periods Response:', JSON.stringify(periodData, null, 2));

        // Validate academicYearData is an array
        if (!Array.isArray(academicYearData)) {
          throw new Error(`Invalid academicYearData type: ${typeof academicYearData}`);
        }

        setLevels(levelData || []);
        setAcademicYears(academicYearData || []);
        setPeriods(periodData || []);

        const currentYear = academicYearData.find((year: AcademicYear) => year.name === '2025/2026');
        setSelectedAcademicYearId(currentYear?.id || (academicYearData.length > 0 ? academicYearData[0].id : null));
        console.log('Levels:', JSON.stringify(levelData, null, 2), 'Academic Years:', JSON.stringify(academicYearData, null, 2), 'Periods:', JSON.stringify(periodData, null, 2));
      } catch (err: any) {
        const errorDetails = {
          message: err.message || 'Unknown error',
          response: err.response?.data,
          status: err.response?.status,
          config: err.config,
          stack: err.stack,
        };
        console.error('Initial Fetch Error:', JSON.stringify(errorDetails, null, 2));
        toast.error('Failed to load initial data. Check network or backend status.');
        setLevels([]);
        setAcademicYears([]);
        setPeriods([]);
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
        const [studentsResponse, subjectsResponse] = await Promise.all([
          api.students.getStudentsByLevel(selectedLevelId, academicYear),
          api.subjects.getSubjectsByLevel(selectedLevelId),
        ]);
        console.log('Raw Students Response:', JSON.stringify(studentsResponse, null, 2));
        console.log('Raw Subjects Response:', JSON.stringify(subjectsResponse, null, 2));

        // Fix: studentsResponse is already Student[]
        if (!Array.isArray(studentsResponse)) {
          console.error('Invalid studentsResponse format:', JSON.stringify(studentsResponse, null, 2));
          throw new Error(`Expected array for studentsResponse, got ${typeof studentsResponse}`);
        }

        const filteredStudents = studentsResponse.filter(
          (student: Student) => !(student.firstName === 'Test' && student.lastName === 'Student')
        );
        setStudents(filteredStudents || []);
        setSubjects(subjectsResponse || []);
        console.log('Students:', JSON.stringify(filteredStudents, null, 2), 'Subjects:', JSON.stringify(subjectsResponse, null, 2));
      } catch (err: any) {
        const errorDetails = {
          message: err.message || 'Unknown error',
          response: err.response?.data,
          status: err.response?.status,
          config: err.config,
        };
        console.error('Fetch Error:', JSON.stringify(errorDetails, null, 2));
        toast.error('Failed to load students or subjects');
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
    if (score !== null && (score < 0 || score > 100)) {
      toast.error('Score must be between 0 and 100');
      return;
    }
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
    if (students.length === 0) {
      toast.error('No enrolled students found for the selected level and academic year');
      console.error('No students available:', JSON.stringify({ selectedLevelId, academicYear }, null, 2));
      return;
    }
    const validGrades = Object.entries(grades)
      .filter(([studentId, score]) => score !== null && students.some((s) => s.id === parseInt(studentId)))
      .map(([studentId, score]) => ({
        student_id: parseInt(studentId),
        score: Math.round(score!), // Ensure integer score
      }));
    if (validGrades.length === 0) {
      toast.error('No valid grades to submit. Ensure grades are entered for enrolled students.');
      console.error('No valid grades:', JSON.stringify({ grades, students: students.map(s => s.id) }, null, 2));
      return;
    }
    const gradeData = {
      level: selectedLevelId,
      subject_id: selectedSubjectId,
      period_id: selectedPeriodId,
      academic_year: academicYear,
      grades: validGrades,
    };
    console.log('Submitting grades:', JSON.stringify(gradeData, null, 2));
    try {
      const response = await api.grade_sheets.postGrades(gradeData);
      console.log('Grade submission response:', JSON.stringify(response, null, 2));
      toast.success('Grades submitted successfully');
      setGrades({});
      setExistingGrades([]);
      setRefresh((prev) => prev + 1);
    } catch (err: any) {
      const errorDetails = {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      };
      console.error('Submit Error:', JSON.stringify(errorDetails, null, 2));
      const errorMessage = err.response?.data?.message || 'Failed to submit grades';
      toast.error(errorMessage);
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
      console.log('Raw Grades Response:', JSON.stringify(data, null, 2));
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
    } catch (err: any) {
      const errorDetails = {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      };
      console.error('Check Error:', JSON.stringify(errorDetails, null, 2));
      toast.error('Failed to load existing grades');
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
    if (students.length === 0) {
      toast.error('No enrolled students found for the selected level and academic year');
      console.error('No students available:', JSON.stringify({ selectedLevelId, academicYear }, null, 2));
      return;
    }
    const validGrades = Object.entries(grades)
      .filter(([studentId, score]) => score !== null && students.some((s) => s.id === parseInt(studentId)))
      .map(([studentId, score]) => ({
        student_id: parseInt(studentId),
        score: Math.round(score!), // Ensure integer score
      }));
    if (validGrades.length === 0) {
      toast.error('No valid grades to update. Ensure grades are entered for enrolled students.');
      console.error('No valid grades:', JSON.stringify({ grades, students: students.map(s => s.id) }, null, 2));
      return;
    }
    const updateData = {
      level: selectedLevelId,
      subject_id: selectedSubjectId,
      period_id: selectedPeriodId,
      academic_year: academicYear,
      grades: validGrades,
    };
    console.log('Updating grades:', JSON.stringify(updateData, null, 2));
    try {
      const response = await api.grade_sheets.postGrades(updateData);
      console.log('Grade update response:', JSON.stringify(response, null, 2));
      toast.success('Grades updated successfully');
      setExistingGrades([]);
      setGrades({});
      setRefresh((prev) => prev + 1);
    } catch (err: any) {
      const errorDetails = {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      };
      console.error('Update Error:', JSON.stringify(errorDetails, null, 2));
      const errorMessage = err.response?.data?.message || 'Failed to update grades';
      toast.error(errorMessage);
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