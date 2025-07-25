
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRefresh } from '../context/RefreshContext';
import { apiClient } from '../api/apiClient';
import { Level, Student, AcademicYear } from '../types';

export const useStudentManagement = () => {
  const { setRefresh } = useRefresh();
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<number | null>(null); // Changed to number
  const [levels, setLevels] = useState<Level[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingLevels, setLoadingLevels] = useState(true);
  const [loadingAcademicYears, setLoadingAcademicYears] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchAcademicYears = async () => {
      setLoadingAcademicYears(true);
      try {
        const data = await apiClient.academicYears.getAcademicYears();
        console.log('Fetched Academic Years:', data);
        setAcademicYears(data);
        const currentYear = data.find((year) => year.name === '2025/2026');
        setSelectedAcademicYear(currentYear?.id || (data.length > 0 ? data[0].id : null)); // Use id
      } catch (err) {
        toast.error('Failed to load academic years');
        setSelectedAcademicYear(null);
      } finally {
        setLoadingAcademicYears(false);
      }
    };
    fetchAcademicYears();
  }, []);

  useEffect(() => {
    const fetchLevels = async () => {
      setLoadingLevels(true);
      try {
        const data = await apiClient.levels.getLevels();
        console.log('Fetched Levels:', data);
        setLevels(data);
        if (data.length > 0) setSelectedLevelId(data[0].id);
      } catch (err) {
        toast.error('Failed to load levels');
        setSelectedLevelId(null);
      } finally {
        setLoadingLevels(false);
      }
    };
    fetchLevels();
  }, []);

  useEffect(() => {
    if (!selectedAcademicYear || !selectedLevelId) {
      setStudents([]);
      return;
    }
    const fetchStudents = async () => {
      setLoading(true);
      try {
        console.log('Fetching students with:', { selectedLevelId, selectedAcademicYear });
        const data = await apiClient.students.getStudentsByLevel(selectedLevelId, selectedAcademicYear);
        console.log('Fetched Students:', data);
        setStudents(data || []);
      } catch (err) {
        toast.error('Failed to load students');
        console.error('Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [selectedAcademicYear, selectedLevelId]);

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleDelete = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedStudent) return;
    setLoading(true);
    try {
      await apiClient.students.updateStudent(selectedStudent.id, {
        firstName: selectedStudent.firstName,
        lastName: selectedStudent.lastName,
        gender: selectedStudent.gender,
        dob: selectedStudent.dob,
        level: selectedStudent.level_id,
        academic_year: typeof selectedStudent.academic_year === 'object'
          ? selectedStudent.academic_year.id
          : selectedStudent.academic_year,
      });
      toast.success('Student updated successfully');
      setIsEditModalOpen(false);
      setRefresh((prev) => (prev === 0 ? 1 : 0));
    } catch (err) {
      toast.error('Failed to update student');
      console.error('Update Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedStudent) return;
    setLoading(true);
    try {
      await apiClient.students.deleteStudent(selectedStudent.id);
      toast.success('Student deleted successfully');
      setIsDeleteModalOpen(false);
      setRefresh((prev) => (prev === 0 ? 1 : 0));
    } catch (err) {
      toast.error('Failed to delete student');
      console.error('Delete Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getLevelName = (levelId: number) => {
    const level = levels.find(l => l.id === levelId);
    return level ? level.name : 'Unknown';
  };

  return {
    academicYears,
    selectedAcademicYear,
    setSelectedAcademicYear,
    levels,
    selectedLevelId,
    setSelectedLevelId,
    students,
    loading,
    loadingLevels,
    loadingAcademicYears,
    selectedStudent,
    setSelectedStudent,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleEdit,
    handleDelete,
    handleSaveEdit,
    handleConfirmDelete,
    getLevelName,
  };
};
