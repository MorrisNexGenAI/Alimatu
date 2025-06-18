import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api';
import type { Student, Level, AcademicYear, PaginatedResponse } from '../types';

export const useStudent = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [levelData, academicYearData] = await Promise.all([
          api.levels.getLevels(),
          api.academic_years.getAcademicYears(),
        ]);
        const levels = (levelData as unknown as PaginatedResponse<Level>).results || (Array.isArray(levelData) ? levelData : []);
        const academicYears = (academicYearData as unknown as PaginatedResponse<AcademicYear>).results || (Array.isArray(academicYearData) ? academicYearData : []);
        setLevels(levels);
        setAcademicYears(academicYears);
        const currentYear = academicYears.find((year) => year.name === '2025/2026');
        setSelectedAcademicYearId(currentYear?.id || (academicYears.length > 0 ? academicYears[0].id : null));
        console.log('Levels:', levels, 'Academic Years:', academicYears);
      } catch (err) {
        toast.error('Failed to load initial data');
        console.error('Initial Fetch Error:', err);
        setLevels([]);
        setAcademicYears([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!selectedLevelId || !selectedAcademicYearId) {
      setStudents([]);
      return;
    }
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const academicYear = academicYears.find((ay) => ay.id === selectedAcademicYearId)?.name;
        if (!academicYear) throw new Error('Invalid academic year selected');
        const studentsResponse = await api.students.getStudentsByLevel(selectedLevelId, academicYear);
        const studentsData = (studentsResponse as unknown as PaginatedResponse<Student>).results || (Array.isArray(studentsResponse) ? studentsResponse : []);
        const filteredStudents = studentsData.filter(
          (student) => !(student.firstName === 'Test' && student.lastName === 'Student')
        );
        setStudents(filteredStudents || []);
        console.log('Students:', filteredStudents);
      } catch (err) {
        toast.error('Failed to load students');
        console.error('Fetch Students Error:', err);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [selectedLevelId, selectedAcademicYearId, academicYears]);

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const levelId = parseInt(e.target.value) || null;
    setSelectedLevelId(levelId);
    console.log('Selected Level ID:', levelId);
  };

  const handleAcademicYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const academicYearId = parseInt(e.target.value) || null;
    setSelectedAcademicYearId(academicYearId);
    console.log('Selected Academic Year ID:', academicYearId);
  };

  return {
    students,
    levels,
    academicYears,
    selectedLevelId,
    selectedAcademicYearId,
    loading,
    handleLevelChange,
    handleAcademicYearChange,
  };
};