import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRefresh } from '../context/RefreshContext';
import { gradesApi } from '../api/grades';
import type { Level, AcademicYear, Subject, Period, Student, GradeEntry, ExistingGrade, PostGradesData } from '../types/index';

export const useGradeEntry = () => {
  const { setRefresh } = useRefresh();
  const [levels, setLevels] = useState<Level[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<number | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [selectedPeriodId, setSelectedPeriodId] = useState<number | null>(null);
  const [grades, setGrades] = useState<Record<number, number | null>>({});
  const [existingGrades, setExistingGrades] = useState<ExistingGrade[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch initial data (levels, academic years, periods)
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [levelResponse, academicYearResponse, periodData] = await Promise.all([
          gradesApi.getLevels(),
          gradesApi.getAcademicYears(),
          gradesApi.getPeriods(),
        ]);

        // Handle potentially paginated levels response
        let levelData: Level[] = [];
        if (Array.isArray(levelResponse)) {
          levelData = levelResponse;
        } else if (levelResponse && typeof levelResponse === 'object' && Array.isArray(levelResponse.results)) {
          levelData = levelResponse.results;
        } else {
          console.warn('Unexpected levelResponse format:', JSON.stringify(levelResponse, null, 2));
          throw new Error('Invalid levels response format');
        }

        // Handle potentially paginated academic years response
        let academicYearData: AcademicYear[] = [];
        if (Array.isArray(academicYearResponse)) {
          academicYearData = academicYearResponse;
        } else if (academicYearResponse && typeof academicYearResponse === 'object' && Array.isArray(academicYearResponse.results)) {
          academicYearData = academicYearResponse.results;
        } else {
          console.warn('Unexpected academicYearResponse format:', JSON.stringify(academicYearResponse, null, 2));
          throw new Error('Invalid academic years response format');
        }

        console.log('Processed Levels:', JSON.stringify(levelData, null, 2));
        console.log('Processed Academic Years:', JSON.stringify(academicYearData, null, 2));

        setLevels(levelData);
        setAcademicYears(academicYearData);
        setPeriods(periodData);

        const currentYear = academicYearData.find((year) => year.name === '2025/2026');
        setSelectedAcademicYearId(currentYear?.id || academicYearData[0]?.id || null);
      } catch (err: any) {
        console.error('Initial Fetch Error:', JSON.stringify({
          message: err.message || 'Unknown error',
          response: err.response?.data,
          status: err.response?.status,
        }, null, 2));
        toast.error('Failed to load initial data');
        setLevels([]);
        setAcademicYears([]);
        setPeriods([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch students and subjects when level or academic year changes
  useEffect(() => {
    if (!selectedLevelId || !selectedAcademicYearId) {
      setStudents([]);
      setSubjects([]);
      setSelectedSubjectId(null);
      setGrades({});
      setExistingGrades([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const academicYear = academicYears.find((ay) => ay.id === selectedAcademicYearId)?.name;
        if (!academicYear) throw new Error('Invalid academic year selected');
        const [studentData, subjectResponse] = await Promise.all([
          gradesApi.getStudentsByLevel(selectedLevelId, academicYear),
          gradesApi.getSubjectsByLevel(selectedLevelId),
        ]);

        // Handle potentially paginated subjects response
        let subjectData: Subject[] = [];
        if (Array.isArray(subjectResponse)) {
          subjectData = subjectResponse;
        } else if (subjectResponse && typeof subjectResponse === 'object' && Array.isArray(subjectResponse.results)) {
          subjectData = subjectResponse.results;
        } else {
          console.warn('Unexpected subjectResponse format:', JSON.stringify(subjectResponse, null, 2));
          throw new Error('Invalid subjects response format');
        }

        console.log('Processed Subjects:', JSON.stringify(subjectData, null, 2));

        const filteredStudents = studentData.filter(
          (student) => !(student.firstName === 'Test' && student.lastName === 'Student')
        );
        setStudents(filteredStudents);
        setSubjects(subjectData);
      } catch (err: any) {
        console.error('Fetch Data Error:', JSON.stringify({
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        }, null, 2));
        toast.error('Failed to load students or subjects');
        setStudents([]);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedLevelId, selectedAcademicYearId, academicYears]);

  // Handle input changes
  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const levelId = parseInt(e.target.value) || null;
    setSelectedLevelId(levelId);
    setSelectedSubjectId(null);
    setSelectedPeriodId(null);
    setGrades({});
    setExistingGrades([]);
  };

  const handleAcademicYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const academicYearId = parseInt(e.target.value) || null;
    setSelectedAcademicYearId(academicYearId);
    setSelectedSubjectId(null);
    setSelectedPeriodId(null);
    setGrades({});
    setExistingGrades([]);
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subjectId = parseInt(e.target.value) || null;
    setSelectedSubjectId(subjectId);
    setGrades({});
    setExistingGrades([]);
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const periodId = parseInt(e.target.value) || null;
    setSelectedPeriodId(periodId);
    setGrades({});
    setExistingGrades([]);
  };

  const handleGradeChange = (studentId: number, value: string) => {
    const score = value === '' ? null : parseInt(value);
    if (score !== null && (score < 0 || score > 100)) {
      toast.error('Score must be between 0 and 100');
      return;
    }
    setGrades((prev) => ({ ...prev, [studentId]: score }));
  };

  // Check for existing grades
  const handleCheckExistingGrades = async () => {
    if (!selectedLevelId || !selectedSubjectId || !selectedPeriodId || !selectedAcademicYearId) {
      toast.error('Please select level, academic year, subject, and period');
      return;
    }
    const academicYear = academicYears.find((ay) => ay.id === selectedAcademicYearId)?.name;
    if (!academicYear) {
      toast.error('Invalid academic year selected');
      return;
    }
    setLoading(true);
    try {
      const data = await gradesApi.getGradesByPeriodSubject(
        selectedLevelId,
        selectedSubjectId,
        selectedPeriodId,
        academicYear
      );
      setExistingGrades(data);
      const initialGrades = data.reduce(
        (acc: Record<number, number | null>, grade) => ({
          ...acc,
          [grade.student_id]: grade.score,
        }),
        {}
      );
      setGrades(initialGrades);
      toast.success(data.length > 0 ? 'Existing grades loaded' : 'No existing grades found');
    } catch (err: any) {
      console.error('Check Grades Error:', JSON.stringify({
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      }, null, 2));
      toast.error('Failed to load existing grades');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
  if (!selectedLevelId || !selectedAcademicYearId || !selectedSubjectId || !selectedPeriodId) {
    toast.error('Please select level, academic year, subject, and period');
    return;
  }
  if (students.length === 0) {
    toast.error('No enrolled students found');
    return;
  }
  const validGrades: GradeEntry[] = Object.entries(grades)
    .filter(([_, score]) => score !== null)
    .map(([studentId, score]) => ({
      student_id: parseInt(studentId),
      score: score!,
      period_id: selectedPeriodId,
    }));
  if (validGrades.length === 0) {
    toast.error('No valid grades to submit');
    return;
  }
  const gradeData: PostGradesData = {
    level: selectedLevelId,
    subject_id: selectedSubjectId,
    period_id: selectedPeriodId,
    academic_year: selectedAcademicYearId, // Use ID instead of name
    grades: validGrades,
  };
  console.log('Submitting grades:', JSON.stringify(gradeData, null, 2));
  try {
    const response = await gradesApi.postGrades(gradeData);
    console.log('Grade Submission Response:', JSON.stringify(response, null, 2));
    if (typeof response === 'string') {
      toast.error('Server returned an unexpected response. Please check the server configuration.');
      console.error('Unexpected response format:', response);
      return;
    }
    if (response.errors && response.errors.length > 0) {
      toast.error(`Some grades failed: ${response.errors.map(e => e.error).join(', ')}`);
    } else {
      toast.success('Grades submitted successfully');
    }
    setGrades({});
    setExistingGrades([]);
    setRefresh((prev) => prev + 1);
  } catch (err: any) {
    console.error('Submit Grades Error:', JSON.stringify({
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
    }, null, 2));
    const errorMessage = err.response?.data?.error || err.message || 'Failed to submit grades';
    toast.error(errorMessage);
  }
};

  return {
    levels,
    academicYears,
    subjects,
    periods,
    students,
    selectedLevelId,
    selectedAcademicYearId,
    selectedSubjectId,
    selectedPeriodId,
    grades,
    existingGrades,
    loading,
    handleLevelChange,
    handleAcademicYearChange,
    handleSubjectChange,
    handlePeriodChange,
    handleGradeChange,
    handleCheckExistingGrades,
    handleSubmit,
  };
};