import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api';
import type { Student, Level, AcademicYear, PaginatedResponse, StudentEnrollmentData } from '../types';

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
          api.levels.getLevels(),
          api.academic_years.getAcademicYears(),
        ]);

        // Handle paginated levels response
        let levelData: Level[] = [];
        if (Array.isArray(levelResponse)) {
          levelData = levelResponse;
        } else if (levelResponse && typeof levelResponse === 'object' && Array.isArray(levelResponse.results)) {
          levelData = levelResponse.results;
        } else {
          console.warn('Unexpected levelResponse format:', JSON.stringify(levelResponse, null, 2));
          throw new Error('Invalid levels response format');
        }

        // Handle paginated academic years response
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

        const currentYear = academicYearData.find((year) => year.name === '2024/2025');
        setSelectedAcademicYearId(currentYear?.id || academicYearData[0]?.id || null);
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
        const studentsResponse = await api.students.getStudentsByLevel(selectedLevelId, academicYear);
        console.log('Raw Students Response:', JSON.stringify(studentsResponse, null, 2));
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
        date_enrolled: new Date().toISOString().split('T')[0], // e.g., "2025-06-20"
      };
      const newStudent = await api.students.addStudentAndEnroll(studentData);
      // Refresh student list
      const academicYear = academicYears.find((ay) => ay.id === selectedAcademicYearId)?.name;
      if (academicYear) {
        const updatedStudents = await api.students.getStudentsByLevel(selectedLevelId, academicYear);
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