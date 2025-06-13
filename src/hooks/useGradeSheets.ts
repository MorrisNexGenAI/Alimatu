// src/hooks/useGradeSheets.ts
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRefresh } from '../context/RefreshContext';
import { api } from '../api';
import { BASE_URL } from '../api/config';
import type { Level, Student, AcademicYear, GradeSheet } from '../types';

export const useGradeSheets = () => {
  const { refresh, setRefresh } = useRefresh();
  const [levels, setLevels] = useState<Level[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [gradeSheets, setGradeSheets] = useState<GradeSheet[]>([]);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [pdfUrls, setPdfUrls] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setErrors({});
      try {
        const [levelData, academicYearData] = await Promise.all([
          api.levels.getLevels(),
          api.academic_years.getAcademicYears(),
        ]);
        setLevels(levelData);
        setAcademicYears(academicYearData);
        const currentYear = academicYearData.find((year) => year.name === '2025/2026');
        setSelectedAcademicYearId(currentYear?.id || (academicYearData.length > 0 ? academicYearData[0].id : null));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load initial data';
        toast.error(message);
        setErrors((prev) => ({ ...prev, levels: message }));
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
      setPdfUrls({});
      return;
    }

    const fetchLevelData = async () => {
      setLoading(true);
      try {
        const academicYear = academicYears.find((ay) => ay.id === selectedAcademicYearId)?.name;
        if (!academicYear) throw new Error('Invalid academic year selected');
        const [studentData, gradesData] = await Promise.all([
          api.students.getStudentsByLevel(selectedLevelId, academicYear),
          api.grade_sheets.getGradeSheetsByLevel(selectedLevelId, academicYear),
        ]);
        const filteredStudents = studentData.filter(
          (student) => !(student.firstName === 'Test' && student.lastName === 'Student')
        );
        setStudents(filteredStudents);
        setGradeSheets(gradesData);
        setErrors((prev) => ({ ...prev, students: '', grades: '' }));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load level data';
        toast.error(message);
        setErrors((prev) => ({ ...prev, grades: message }));
      } finally {
        setLoading(false);
      }
    };
    fetchLevelData();
  }, [selectedLevelId, selectedAcademicYearId, refresh, academicYears]);

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const levelId = Number(e.target.value) || null;
    setSelectedLevelId(levelId);
    setRefresh((prev) => prev + 1);
  };

  const handleAcademicYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const academicYearId = Number(e.target.value) || null;
    setSelectedAcademicYearId(academicYearId);
    setRefresh((prev) => prev + 1);
  };

  const handleGeneratePDF = async (levelId: number, studentId?: number) => {
    const key = studentId ? `student_${studentId}` : `level_${levelId}`;
    setPdfLoading((prev) => ({ ...prev, [key]: true }));
    try {
      const academicYear = academicYears.find((ay) => ay.id === selectedAcademicYearId)?.name;
      if (!academicYear) throw new Error('Invalid academic year selected');

      const url = studentId
        ? `${BASE_URL}/api/grade_sheets/gradesheet/pdf/generate/?level_id=${encodeURIComponent(levelId)}&student_id=${encodeURIComponent(studentId)}&academic_year=${encodeURIComponent(academicYear)}`
        : `${BASE_URL}/api/grade_sheets/gradesheet/pdf/generate/?level_id=${encodeURIComponent(levelId)}&academic_year=${encodeURIComponent(academicYear)}`;

      const response = await fetch(url, { method: 'GET' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to generate PDF: ${errorData.error || response.statusText}`);
      }
      const data = await response.json();
      const pdfUrl = data.view_url;
      if (!pdfUrl) throw new Error('No PDF URL returned from server');

      const fullPdfUrl = pdfUrl.startsWith('http') ? pdfUrl : `${BASE_URL}${pdfUrl}`;
      setPdfUrls((prev) => ({ ...prev, [key]: fullPdfUrl }));
      window.open(fullPdfUrl, '_blank');
      toast.success('PDF generated and opened!');
    } catch (err) {
      console.error('PDF generation error:', err);
      toast.error(`Failed to generate PDF: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setPdfLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  return {
    levels,
    academicYears,
    selectedLevelId,
    selectedAcademicYearId,
    students,
    gradeSheets,
    loading,
    pdfLoading,
    errors,
    pdfUrls,
    handleLevelChange,
    handleAcademicYearChange,
    handleGeneratePDF,
  };
};