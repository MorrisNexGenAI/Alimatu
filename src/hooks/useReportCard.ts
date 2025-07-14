import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRefresh } from '../context/RefreshContext';
import {apiClient} from '../api/apiClient'
import type { Level, AcademicYear, PassFailedStatus, UseReportCardReturn } from '../types/index';

export const useReportCard = (): UseReportCardReturn => {
  const { refresh, setRefresh } = useRefresh();
  const [levels, setLevels] = useState<Level[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<number | null>(null);
  const [statuses, setStatuses] = useState<PassFailedStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [pdfUrls, setPdfUrls] = useState<{ [key: string]: string }>({});
  const [pdfLoading, setPdfLoading] = useState<{ [key: string]: boolean }>({});
  const [modal, setModal] = useState<{ show: boolean; statusId?: number; action?: string }>({ show: false });

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [levelResponse, AcademicYearResponse] = await Promise.all([
          apiClient.levels.getLevels(),
          apiClient.academicYears.getAcademicYears(),
        ]);


        setLevels(levelResponse);
        setAcademicYears(AcademicYearResponse);
        const currentYear = AcademicYearResponse.find((year) => year.name === '2025/2026');
        setSelectedAcademicYearId(currentYear?.id || (AcademicYearResponse.length > 0 ? AcademicYearResponse[0].id : null));
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
        const statusData = await apiClient.pass_failed_statues.getStatusesByLevelAndYear(selectedLevelId, academicYear);
        console.log('Raw Status Data Response:', JSON.stringify(statusData, null, 2));
        const filteredStatuses = statusData.filter(
          (status) => !(status.student.firstName === 'Test' && status.student.lastName === 'Student')
        );
        setStatuses(filteredStatuses);
        setErrors((prev) => ({ ...prev, statuses: '' }));
      } catch (err: any) {
        const message = err.response?.data?.error || (err instanceof Error ? err.message : 'Unknown error');
        console.error('Fetch Statuses Error:', JSON.stringify({
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        }, null, 2));
        toast.error(`Failed to load statuses: ${message}`);
        setErrors((prev) => ({ ...prev, statuses: message }));
        setStatuses([]);
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

  const handleGenerateYearlyPDF = async (
    status: 'pass' | 'fail' | 'conditional',
    studentId?: number
  ): Promise<void> => {
    if (!selectedLevelId || !selectedAcademicYearId) {
      toast.error('Please select a level and academic year');
      return;
    }
    const key = studentId ? `student_${studentId}_${status}` : `level_${selectedLevelId}_${status}`;
    setPdfLoading((prev) => ({ ...prev, [key]: true }));
    try {
      const response = await apiClient.pdfs.generateYearlyPDF(selectedLevelId, selectedAcademicYearId, studentId ? undefined : status, studentId);
      setPdfUrls((prev) => ({ ...prev, [key]: response.view_url }));
      window.open(response.view_url, '_blank');
      toast.success(`Yearly ${studentId ? 'student' : 'level'} ${status} PDF generated successfully!`);
    } catch (err: any) {
      const message = err.response?.data?.error || (err instanceof Error ? err.message : 'Unknown error');
      toast.error(`Failed to generate yearly ${status} PDF: ${message}`);
      console.error(`Yearly ${status} PDF generation error:`, err);
    } finally {
      setPdfLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleConfirmModal = async (): Promise<void> => {
    if (!modal.action) return;
    try {
      const [type, status] = modal.action.split('_');
      if (type === 'level') {
        await handleGenerateYearlyPDF(status as 'pass' | 'fail' | 'conditional');
      } else if (type === 'student' && modal.statusId) {
        const studentStatus = statuses.find((s) => s.id === modal.statusId);
        if (!studentStatus) throw new Error('Student status not found');
        await handleGenerateYearlyPDF(status as 'pass' | 'fail' | 'conditional', studentStatus.student.id);
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
    pdfLoading,
    modal,
    allStatusesReady,
    handleLevelChange,
    handleAcademicYearChange,
    handleGenerateYearlyPDF,
    handleConfirmModal,
    openModal,
    closeModal,
  };
};
