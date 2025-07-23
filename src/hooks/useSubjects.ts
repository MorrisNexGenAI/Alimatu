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

  // Fetch levels on mount
  const fetchLevels = async () => {
    setLoading(true);
    try {
      const levelResults = await apiClient.levels.getLevels();
      console.log('Fetched Levels:', levelResults); // Why: Debug API response
      setLevels(levelResults);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch levels';
      setError(errorMessage);
      toast.error(errorMessage);
      // Why: Avoid clearing levels to preserve existing data
    } finally {
      setLoading(false);
    }
  };

  // Fetch subjects when selectedLevelId changes
  const fetchSubjects = async () => {
    if (!selectedLevelId) {
      setSubjects([]);
      return;
    }
    setLoading(true);
    try {
      const subjectResponse = await apiClient.subjects.getSubjectsByLevel(selectedLevelId);
      console.log('Fetched Subjects:', subjectResponse); // Why: Debug API response
      setSubjects(subjectResponse);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch subjects';
      setError(errorMessage);
      toast.error(errorMessage);
      // Why: Avoid clearing subjects to preserve existing data
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

  const createSubject = async (data: { subject: string; level_id: number }) => {
    if (!selectedLevelId) {
      toast.error('Please select a level');
      return;
    }
    setLoading(true);
    try {
      console.log('Create Subject Payload:', data); // Why: Debug payload
      const newSubject = await apiClient.subjects.createSubject(data);
      await fetchSubjects(); // Why: Refetch to sync with backend
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

  const updateSubject = async (id: number, data: { subject: string; level_id: number }) => {
    setLoading(true);
    try {
      console.log('Update Subject Payload:', { id, ...data }); // Why: Debug payload
      const updatedSubject = await apiClient.subjects.updateSubject(id, data);
      await fetchSubjects(); // Why: Refetch to sync with backend
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
      await fetchSubjects(); // Why: Refetch to sync with backend
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