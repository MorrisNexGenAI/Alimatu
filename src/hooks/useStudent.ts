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
        console.log('Raw Levels Response:', JSON.stringify(levelData, null, 2));
        console.log('Raw Academic Years Response:', JSON.stringify(academicYearData, null, 2));

        setLevels(levelData);
        setAcademicYears(academicYearData);
        const currentYear = academicYears.find((year: AcademicYear) => year.name === '2025/2026');
        setSelectedAcademicYearId(currentYear?.id || (academicYears.length > 0 ? academicYears[0].id : null));
        console.log('Processed Levels:', JSON.stringify(levelData, null, 2), 'Academic Years:', JSON.stringify(academicYearData, null, 2));
      } catch (err: any) {
        const errorDetails = {
          message: err.message || 'Unknown error',
          response: err.response?.data,
          status: err.response?.status,
          config: err.config,
          stack: err.stack,
        };
        console.error('Initial Fetch Error:', JSON.stringify(errorDetails, null, 2));
        toast.error('Failed to load initial data');
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
        console.log('Raw Students Response:', JSON.stringify(studentsResponse, null, 2));
        const filteredStudents = studentsResponse.filter(
          (student: Student) => !(student.firstName === 'Test' && student.lastName === 'Student')
        );
        setStudents(filteredStudents || []);
        console.log('Students:', JSON.stringify(filteredStudents, null, 2));
      } catch (err: any) {
        const errorDetails = {
          message: err.message || 'Unknown error',
          response: err.response?.data,
          status: err.response?.status,
          config: err.config,
        };
        console.error('Fetch Students Error:', JSON.stringify(errorDetails, null, 2));
        toast.error('Failed to load students');
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