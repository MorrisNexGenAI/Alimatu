import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiClient } from '../api/apiClient';
import type { Level, Subject } from '../types';

export const useSubjects = () => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);

  const fetchLevels = async () => {
    setLoading(true);
    try {
      const levelResults = await apiClient.levels.getLevels();
      console.log('Fetched Levels:', levelResults);
      setLevels(levelResults);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch levels';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    if (!selectedLevelId) {
      setSubjects([]);
      return;
    }
    setLoading(true);
    try {
      const subjectResponse = await apiClient.subjects.getSubjectsByLevel(selectedLevelId);
      console.log('Fetched Subjects:', subjectResponse);
      setSubjects(subjectResponse);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch subjects';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [selectedLevelId]);

  const createSubject = async (data: { subject: string; level_id: string }) => {
    if (!selectedLevelId) {
      toast.error('Please select a level');
      return;
    }
    const levelId = parseInt(data.level_id);
    if (isNaN(levelId) || !levels.some(level => level.id === levelId)) {
      toast.error('Invalid level ID');
      return;
    }
    setLoading(true);
    try {
      const payload = { subject: data.subject, level: levelId };
      console.log('Create Subject Payload:', payload);
      const newSubject = await apiClient.subjects.createSubject(payload);
      await fetchSubjects();
      toast.success('Subject created successfully');
      setError(null);
      return newSubject;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create subject';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSubject = async (id: number, data: { subject: string; level_id: string }) => {
    const levelId = parseInt(data.level_id);
    if (isNaN(levelId) || !levels.some(level => level.id === levelId)) {
      toast.error('Invalid level ID');
      return;
    }
    setLoading(true);
    try {
      const payload = { subject: data.subject, level: levelId };
      console.log('Update Subject Payload:', { id, ...payload });
      const updatedSubject = await apiClient.subjects.updateSubject(id, payload);
      await fetchSubjects();
      toast.success('Subject updated successfully');
      setError(null);
      return updatedSubject;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update subject';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSubject = async (id: number) => {
    setLoading(true);
    try {
      await apiClient.subjects.deleteSubject(id);
      await fetchSubjects();
      toast.success('Subject deleted successfully');
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete subject';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const levelId = parseInt(e.target.value) || null;
    setSelectedLevelId(levelId);
  };

  return {
    subjects,
    levels,
    selectedLevelId,
    loading,
    error,
    handleLevelChange,
    createSubject,
    updateSubject,
    deleteSubject,
  };
};