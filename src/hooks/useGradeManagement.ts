import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api';
import type { Level, AcademicYear, Student, Subject, Period, GradeSheet } from '../types';

export const useGradeManagement = () => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [gradesheets, setGradeSheets] = useState<GradeSheet[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<number | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [selectedPeriodId, setSelectedPeriodId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setErrors({});
      try {
        const [levelData, academicYearData, periodData] = await Promise.all([
          api.levels.getLevels(),
          api.academic_years.getAcademicYears(),
          api.periods.getPeriods(),
        ]);
        setLevels(levelData);
        setAcademicYears(academicYearData);
        setPeriods(periodData);
        if (academicYearData.length > 0) {
          setSelectedAcademicYearId(academicYearData[0].id);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load data';
        toast.error(message);
        setErrors({ initial: message });
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
      setGradeSheets([]);
      return;
    }
    const fetchLevelData = async () => {
      setLoading(true);
      setErrors({});
      try {
        const academicYear = academicYears.find((ay) => ay.id === selectedAcademicYearId);
        if (!academicYear) throw new Error('Invalid academic year');
        const [studentData, subjectData, gradesheetData] = await Promise.all([
          api.students.getStudentsByLevel(selectedLevelId, academicYear.name),
          api.subjects.getSubjectsByLevel(selectedLevelId),
          api.grade_sheets.getGradeSheetsByLevel(selectedLevelId, academicYear.name),
        ]);
        setStudents(studentData);
        setSubjects(subjectData);
        setGradeSheets(gradesheetData);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load level data';
        toast.error(message);
        setErrors({ level: message });
      } finally {
        setLoading(false);
      }
    };
    fetchLevelData();
  }, [selectedLevelId, selectedAcademicYearId]);

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLevelId(parseInt(e.target.value) || null);
    setSelectedSubjectId(null);
    setSelectedPeriodId(null);
  };

  const handleAcademicYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAcademicYearId(parseInt(e.target.value) || null);
    setSelectedSubjectId(null);
    setSelectedPeriodId(null);
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubjectId(parseInt(e.target.value) || null);
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriodId(parseInt(e.target.value) || null);
  };

  const handleGradesSubmitted = () => {
    if (selectedLevelId && selectedAcademicYearId) {
      const academicYear = academicYears.find((ay) => ay.id === selectedAcademicYearId);
      if (academicYear) {
        api.grade_sheets.getGradeSheetsByLevel(selectedLevelId, academicYear.name)
          .then((data) => setGradeSheets(data))
          .catch((err) => toast.error('Failed to refresh gradesheets'));
      }
    }
  };

  return {
    levels,
    academicYears,
    students,
    subjects,
    periods,
    gradesheets,
    selectedLevelId,
    selectedAcademicYearId,
    selectedSubjectId,
    selectedPeriodId,
    loading,
    errors,
    handleLevelChange,
    handleAcademicYearChange,
    handleSubjectChange,
    handlePeriodChange,
    handleGradesSubmitted,
  };
};