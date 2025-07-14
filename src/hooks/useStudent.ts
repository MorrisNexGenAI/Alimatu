// hooks/useStudents.ts
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { apiClient } from '../api/apiClient';
import type { Student, Level, AcademicYear, StudentEnrollmentData } from '../types';

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
        const [levelResponse, academicYearResponse] = await Promise.all([
          apiClient.levels.getLevels(),
          apiClient.academicYears.getAcademicYears(),
        ]);

        setLevels(levelResponse);
        setAcademicYears(academicYearResponse);

        const currentYear = academicYearResponse.find((year) => year.name === '2024/2025');
        setSelectedAcademicYearId(currentYear?.id || academicYearResponse[0]?.id || null);
      } catch (err: any) {
        console.error('Initial Fetch Error:', JSON.stringify({
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        }, null, 2));
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
        const studentsResponse = await apiClient.students.getStudentsByLevel(selectedLevelId, academicYear);
        const filteredStudents = studentsResponse.filter(
          (student: Student) => !(student.firstName === 'Test' && student.lastName === 'Student')
        );
        setStudents(filteredStudents || []);
        console.log('Students:', JSON.stringify(filteredStudents, null, 2));
      } catch (err: any) {
        console.error('Fetch Students Error:', JSON.stringify({
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        }, null, 2));
        toast.error('Failed to load students');
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [selectedLevelId, selectedAcademicYearId, academicYears]);

  const addStudentAndEnroll = async (data: {
    firstName: string;
    lastName: string;
    gender: 'M' | 'F' | 'O';
    dob: string;
  }) => {
    if (!selectedLevelId || !selectedAcademicYearId) {
      toast.error('Please select a level and academic year');
      return;
    }
    setLoading(true);
    try {
      const studentData: StudentEnrollmentData = {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        dob: data.dob,
        level_id: selectedLevelId,
        academic_year_id: selectedAcademicYearId,
        date_enrolled: new Date().toISOString().split('T')[0],
      };
      const newStudent = await apiClient.students.addStudentAndEnroll(studentData);
      const academicYear = academicYears.find((ay) => ay.id === selectedAcademicYearId)?.name;
      if (academicYear) {
        const updatedStudents = await apiClient.students.getStudentsByLevel(selectedLevelId, academicYear);
        const filteredStudents = updatedStudents.filter(
          (student: Student) => !(student.firstName === 'Test' && student.lastName === 'Student')
        );
        setStudents(filteredStudents || []);
      }
      toast.success('Student added and enrolled successfully');
    } catch (err: any) {
      console.error('Add Student and Enroll Error:', JSON.stringify({
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      }, null, 2));
      toast.error(err.response?.data?.error || 'Failed to add student');
    } finally {
      setLoading(false);
    }
  };

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
    addStudentAndEnroll,
  };
};