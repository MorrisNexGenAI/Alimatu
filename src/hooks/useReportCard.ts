import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRefresh } from '../context/RefreshContext';
import { api } from '../api';
import type { Level, AcademicYear, PassFailedStatus } from '../types';

export const useReportCard = () => {
  const { refresh, setRefresh } = useRefresh();
  const [levels, setLevels] = useState<Level[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<number | null>(null);
  const [statuses, setStatuses] = useState<PassFailedStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [pdfUrls, setPdfUrls] = useState<{ [key: string]: string }>({});
  const [modal, setModal] = useState<{ show: boolean; statusId?: number; action?: string }>({ show: false });

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [levelData, yearData] = await Promise.all([
          api.levels.getLevels(),
          api.academic_years.getAcademicYears(),
        ]);
        setLevels(levelData);
        setAcademicYears(yearData);
        const currentYear = yearData.find((year) => year.name === '2025/2026');
        setSelectedAcademicYearId(currentYear?.id || (yearData.length > 0 ? yearData[0].id : null));
      } catch (err: any) {
        const message = err.response?.data?.error || (err instanceof Error ? err.message : 'Unknown error');
        toast.error(`Failed to load initial data: ${message}`);
        setErrors((prev) => ({ ...prev, initial: message }));
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!selectedLevelId || !selectedAcademicYearId) {
      setStatuses([]);
      setPdfUrls({});
      return;
    }

    const fetchStatuses = async () => {
      setLoading(true);
      try {
        const academicYear = academicYears.find((ay) => ay.id === selectedAcademicYearId)?.name;
        if (!academicYear) throw new Error('Invalid academic year selected');
        const statusData = await api.pass_failed_statuses.getStatusesByLevelAndYear(selectedLevelId, academicYear);
        const filteredStatuses = statusData.filter(
          (status) => !(status.student.firstName === 'Test' && status.student.lastName === 'Student')
        );
        setStatuses(filteredStatuses);
        setErrors((prev) => ({ ...prev, statuses: '' }));
      } catch (err: any) {
        const message = err.response?.data?.error || (err instanceof Error ? err.message : 'Unknown error');
        toast.error(`Failed to load statuses: ${message}`);
        setErrors((prev) => ({ ...prev, statuses: message }));
      } finally {
        setLoading(false);
      }
    };
    fetchStatuses();
  }, [selectedLevelId, selectedAcademicYearId, refresh, academicYears]);

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedLevelId(Number(e.target.value) || null);
    setRefresh((prev) => prev + 1);
  };

  const handleAcademicYearChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedAcademicYearId(Number(e.target.value) || null);
    setRefresh((prev) => prev + 1);
  };

  const handleSetStatus = async (statusId: number, status: 'PASS' | 'FAIL' | 'CONDITIONAL'): Promise<void> => {
    try {
      await api.pass_failed_statuses.validateStatus(statusId, status, 'admin');
      toast.success(`Student marked as ${status.toLowerCase()}`);
      setRefresh((prev) => prev + 1);
    } catch (err: any) {
      const message = err.response?.data?.error || (err instanceof Error ? err.message : 'Unknown error');
      toast.error(`Failed to set status: ${message}`);
    }
  };

  const handleGeneratePDF = async (studentId?: number): Promise<void> => {
    if (!selectedLevelId || !selectedAcademicYearId) {
      toast.error('Please select a level and academic year');
      return;
    }
    try {
      const academicYear = academicYears.find((ay) => ay.id === selectedAcademicYearId)?.name;
      if (!academicYear) throw new Error('Invalid academic year selected');
      const response = await api.grade_sheets.printReportCard(
        selectedLevelId,
        academicYear,
        studentId,
        'yearly'
      ) as { view_url?: string } | undefined;
      if (response && typeof response === 'object' && 'view_url' in response && response.view_url) {
        const key = studentId ? `student_${studentId}` : `level_${selectedLevelId}`;
        setPdfUrls((prev) => ({ ...prev, [key]: response.view_url! }));
        toast.success('Report card generated successfully! Click the link to view.');
      } else {
        throw new Error('Invalid response from server: missing view_url');
      }
    } catch (err: any) {
      const message = err.response?.data?.error || (err instanceof Error ? err.message : 'Unknown error');
      toast.error(`Failed to generate report card: ${message}`);
      console.error('PDF generation error:', err);
    }
  };

  const handlePromoteStudent = async (statusId: number): Promise<void> => {
    try {
      const status = statuses.find((s) => s.id === statusId);
      if (!status) throw new Error('Status not found');
      if (!selectedLevelId) throw new Error('No level selected');
      await api.pass_failed_statuses.promoteStudent(statusId, selectedLevelId, 'admin');
      toast.success(`Student ${status.student.firstName} ${status.student.lastName} promoted successfully`);
      setRefresh((prev) => prev + 1);
    } catch (err: any) {
      const message = err.response?.data?.error || (err instanceof Error ? err.message : 'Unknown error');
      toast.error(`Failed to promote student: ${message}`);
      console.error('Promotion error:', err);
    }
  };

  const handleConfirmModal = async (): Promise<void> => {
    if (!modal.action) return;

    try {
      if (['PASS', 'FAIL', 'CONDITIONAL'].includes(modal.action) && modal.statusId) {
        await handleSetStatus(modal.statusId, modal.action as 'PASS' | 'FAIL' | 'CONDITIONAL');
      } else if (modal.action === 'print' && modal.statusId) {
        const status = statuses.find((s) => s.id === modal.statusId); // Fixed typo: statusStatusId -> statusId
        if (status) await handleGeneratePDF(status.student.id);
      } else if (modal.action === 'print_level') {
        await handleGeneratePDF();
      } else if (modal.action === 'promote' && modal.statusId) {
        await handlePromoteStudent(modal.statusId);
      }
      setModal({ show: false });
    } catch (err: any) {
      const message = err.response?.data?.error || (err instanceof Error ? err.message : 'Unknown error');
      toast.error(`Action failed: ${message}`);
    }
  };

  const openModal = (statusId: number | null, action: string): void => {
    setModal({ show: true, statusId: statusId || undefined, action });
  };

  const closeModal = (): void => {
    setModal({ show: false });
  };

  const allStatusesReady = statuses.length > 0 && statuses.every(
    (s) => s.grades_complete && s.status !== 'INCOMPLETE'
  );

  return {
    levels,
    academicYears,
    selectedLevelId,
    selectedAcademicYearId,
    statuses,
    loading,
    errors,
    pdfUrls,
    modal,
    allStatusesReady,
    handleLevelChange,
    handleAcademicYearChange,
    handleSetStatus,
    handleGeneratePDF,
    handlePromoteStudent,
    handleConfirmModal,
    openModal,
    closeModal,
  };
};