// hooks/useGradeSheets.ts
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRefresh } from '../context/RefreshContext';
import { apiClient } from '../api/apiClient';
import { grade_sheets } from '../api/grade_sheets';
import type { Level, AcademicYear, Subject, Period, GradeSheet, UseGradeSheetsReturn, Student, PdfLoading, PdfUrls } from '../types';

export interface Errors {
  levels?: string;
  academicYears?: string;
  students?: string;
  grades?: string;
  periods?: string;
  subject?: string;
  message?: string;
}

export const useGradeSheets = (): UseGradeSheetsReturn => {
  const { refresh, setRefresh } = useRefresh();
  const [levels, setLevels] = useState<Level[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [selectedPeriodId, setSelectPeriodId] = useState<number | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [gradeSheets, setGradeSheets] = useState<GradeSheet[]>([]);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState<PdfLoading>({});
  const [errors, setErrors] = useState<Errors>({});
  const [pdfUrls, setPdfUrls] = useState<PdfUrls>({});
  const [modal, setModal] = useState<{ show: boolean; studentId?: number; action?: string }>({ show: false });

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setErrors({});
      try {
        const [levelResponse, academicYearResponse, periodResponse] = await Promise.all([
          apiClient.levels.getLevels(),
          apiClient.academicYears.getAcademicYears(),
          apiClient.periods.getPeriods(),
        ]);

        setLevels(levelResponse);
        setAcademicYears(academicYearResponse);
        setPeriods(periodResponse);

        const currentYear = academicYearResponse.find((year) => year.name === '2024/2025');
        setSelectedAcademicYearId(currentYear?.id || academicYearResponse[0]?.id || null);
        if (levelResponse.length > 0) {
          setSelectedLevelId(levelResponse[0].id);
        }
      } catch (err: any) {
        const message = err.message || 'Failed to load initial data';
        console.error('Initial Fetch Error:', JSON.stringify({ message, stack: err.stack }, null, 2));
        toast.error(message);
        setErrors({ levels: 'Failed to load levels', academicYears: 'Failed to load academic years', periods: 'Failed to load periods', subject: 'Failed to load subjects' });
        setLevels([]);
        setAcademicYears([]);
        setPeriods([]);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!selectedLevelId || !selectedAcademicYearId) {
      setStudents([]);
      setGradeSheets([]);
      setSubjects([]);
      setPdfUrls({});
      setErrors({});
      return;
    }

    const fetchLevelData = async () => {
      setLoading(true);
      try {
        const academicYear = academicYears.find((ay) => ay.id === selectedAcademicYearId)?.name.replace('-', '/');
        if (!academicYear) throw new Error('Invalid academic year selected');
        console.log('Fetching data for:', { levelId: selectedLevelId, academicYear });

        const [gradesResponse] = await Promise.all([
        
          apiClient.gradeSheets.getGradeSheetsByLevel(selectedLevelId, academicYear)
           
        ]);

        
        setGradeSheets(gradesResponse);
     

      
        if (gradesResponse.length === 0) {
          setErrors((prev) => ({ ...prev, grades: 'No grades found for this level and academic year' }));
          toast.error('No gradesheets found for the selected level and academic year');
        }
       
      } catch (err: any) {
        const message = err.response?.data?.error || err.message || 'Failed to load level data';
        console.error('Fetch Level Data Error:', JSON.stringify({
          message,
          response: err.response?.data,
          status: err.response?.status,
        }, null, 2));
        toast.error(message);
        setErrors({ students: 'Failed to load students', grades: 'Failed to load gradesheets', subject: 'Failed to load subjects' });
        setStudents([]);
        setGradeSheets([]);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLevelData();
  }, [selectedLevelId, selectedAcademicYearId, refresh, academicYears]);

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const levelId = Number(e.target.value) || null;
    console.log('Level changed:', { levelId, value: e.target.value });
    setSelectedLevelId(levelId);
    setRefresh((prev) => prev + 1);
  };

  const handleAcademicYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const academicYearId = Number(e.target.value) || null;
    console.log('Academic Year changed:', { academicYearId, value: e.target.value });
    setSelectedAcademicYearId(academicYearId);
    setRefresh((prev) => prev + 1);
  };

  const handleGeneratePDF = async (levelId: number, studentId?: number) => {
    const key = studentId ? `student_${studentId}` : `level_${levelId}`;
    setPdfLoading((prev) => ({ ...prev, [key]: true }));
    try {
      if (!selectedAcademicYearId) throw new Error('Invalid academic year selected');
      const response = await grade_sheets.generatePDF(levelId, selectedAcademicYearId, studentId);
      if (!response.view_url) throw new Error('No PDF URL returned from server');
      setPdfUrls((prev) => ({ ...prev, [key]: response.view_url }));
      window.open(response.view_url, '_blank');
      toast.success('Periodic PDF generated and opened!');
    } catch (err: any) {
      console.error('PDF Generation Error:', JSON.stringify({
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      }, null, 2));
      toast.error(`Failed to generate periodic PDF: ${err.message || 'Unknown error'}`);
    } finally {
      setPdfLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const openModal = (studentId: number | null, action: string): void => {
    setModal({ show: true, studentId: studentId || undefined, action });
  };

  const closeModal = (): void => {
    setModal({ show: false });
  };

  const handleConfirmModal = async (): Promise<void> => {
    if (!modal.action || !selectedLevelId) return;
    try {
      if (modal.action === 'print' && modal.studentId) {
        await handleGeneratePDF(selectedLevelId, modal.studentId);
      } else if (modal.action === 'print_level') {
        await handleGeneratePDF(selectedLevelId);
      }
      setModal({ show: false });
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || 'Unknown error';
      toast.error(`Action failed: ${message}`);
    }
  };

  return {
    levels,
    academicYears,
    subjects,
    periods,
    selectedLevelId,
    selectedAcademicYearId,
    selectedSubjectId,
    selectedPeriodId,
    students,
    gradeSheets,
    loading,
    pdfLoading,
    errors,
    pdfUrls,
    modal,
    handleLevelChange,
    handleAcademicYearChange,
    handleGeneratePDF,
    openModal,
    closeModal,
    handleConfirmModal,
  };
};