import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api';
import type { Level, Student } from '../types';

export const useStudent = () => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setErrors({});
      try {
        const levelData = await api.levels.getLevels();
        setLevels(levelData);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load levels';
        toast.error(message);
        setErrors((prev) => ({ ...prev, levels: message }));
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!selectedLevelId) {
      setStudents([]);
      return;
    }

    const fetchStudents = async () => {
      setLoading(true);
      try {
        const studentData = await api.students.getStudentsByLevel(selectedLevelId);
        setStudents(studentData);
        setErrors((prev) => ({ ...prev, students: '' }));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load students';
        toast.error(message);
        setErrors((prev) => ({ ...prev, students: message }));
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [selectedLevelId]);

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLevelId(Number(e.target.value) || null);
  };

  const handleStudentAdded = (newStudent: Student) => {
    setStudents((prev) => [...prev, newStudent]);
  };

  return {
    levels,
    students,
    selectedLevelId,
    loading,
    errors,
    handleLevelChange,
    handleStudentAdded,
  };
};