import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRefresh } from '../context/RefreshContext';
import { api } from '../api';
import type { Level, Student, AcademicYear, GradeSheet } from '../types';
import { grade_sheets } from '../api/grade_sheets';

interface Errors {
  levels?: string;
  academicYears?: string;
  students?: string;
  grades?: string;
}

interface PdfLoading {
  [key: string]: boolean;
}

interface PdfUrls {
  [key: string]: string;
}

export const useGradeSheets = () => {
  const { refresh, setRefresh } = useRefresh();
  const [levels, setLevels] = useState<Level[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [gradeSheets, setGradeSheets] = useState<GradeSheet[]>([]);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState<PdfLoading>({});
  const [errors, setErrors] = useState<Errors>({});
  const [pdfUrls, setPdfUrls] = useState<PdfUrls>({});

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setErrors({});
      try {
        const [levelData, academicYearData] = await Promise.all([
          api.levels.getLevels(),
          api.academic_years.getAcademicYears(),
        ]);
        console.log('Raw Levels Response:', JSON.stringify(levelData, null, 2));
        console.log('Raw Academic Years Response:', JSON.stringify(academicYearData, null, 2));

        if (!Array.isArray(levelData) || !Array.isArray(academicYearData)) {
          throw new Error('Invalid response format for levels or academic years');
        }

        setLevels(levelData);
        setAcademicYears(academicYearData);
        const currentYear = academicYearData.find((year) => year.name === '2025/2026');
        setSelectedAcademicYearId(currentYear?.id || (academicYearData.length > 0 ? academicYearData[0].id : null));
        console.log('Selected Academic Year ID:', currentYear?.id || academicYearData[0]?.id);
      } catch (err: any) {
        const message = err.message || 'Failed to load initial data';
        console.error('Initial Fetch Error:', JSON.stringify({ message, stack: err.stack }, null, 2));
        toast.error(message);
        setErrors({ levels: 'Failed to load levels', academicYears: 'Failed to load academic years' });
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
      setGradeSheets([]);
      setPdfUrls({});
      setErrors({});
      return;
    }

    const fetchLevelData = async () => {
      setLoading(true);
      try {
        const academicYear = academicYears.find((ay) => ay.id === selectedAcademicYearId)?.name;
        if (!academicYear) throw new Error('Invalid academic year selected');
        const [studentData, gradesData] = await Promise.all([
          api.students.getStudentsByLevel(selectedLevelId, academicYear),
          grade_sheets.getGradeSheetsByLevel(selectedLevelId, academicYear),
        ]);
        console.log('Raw Students Response:', JSON.stringify(studentData, null, 2));
        console.log('Raw GradeSheets Response:', JSON.stringify(gradesData, null, 2));

        

        const filteredStudents = Array.isArray(studentData) ? studentData.filter(
  (student: Student) => !(student.firstName === 'Test' && student.lastName === 'Student')
) : [];

        setStudents(filteredStudents);
        setGradeSheets(Array.isArray(gradesData) ? gradesData : []);
        setErrors({});

        console.log('Students Set:', JSON.stringify(filteredStudents, null, 2));
        console.log('GradeSheets Set:', JSON.stringify(gradesData, null, 2));

        if (filteredStudents.length === 0) {
          console.warn('No students found for level_id:', selectedLevelId, 'academic_year:', academicYear);
          setErrors((prev) => ({ ...prev, students: 'No enrolled students found' }));
        }
        if (!gradesData || gradesData.length === 0) {
          console.warn('No gradesheets found for level_id:', selectedLevelId, 'academic_year:', academicYear);
          setErrors((prev) => ({ ...prev, grades: 'No grades found for this level and academic year' }));
        }
      } catch (err: any) {
        const message = err.message || 'Failed to load level data';
        console.error('Fetch Level Data Error:', JSON.stringify({
          message,
          response: err.response?.data,
          status: err.response?.status,
        }, null, 2));
        toast.error(message);
        setErrors({ students: 'Failed to load students', grades: 'Failed to load gradesheets' });
        setStudents([]);
        setGradeSheets([]);
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
    console.log('Selected Level ID:', levelId);
  };

  const handleAcademicYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const academicYearId = Number(e.target.value) || null;
    setSelectedAcademicYearId(academicYearId);
    setRefresh((prev) => prev + 1);
    console.log('Selected Academic Year ID:', academicYearId);
  };

  const handleGeneratePDF = async (levelId: number, studentId?: number) => {
    const key = studentId ? `student_${studentId}` : `level_${levelId}`;
    setPdfLoading((prev) => ({ ...prev, [key]: true }));
    try {
      const academicYear = academicYears.find((ay) => ay.id === selectedAcademicYearId)?.name;
      if (!academicYear) throw new Error('Invalid academic year selected');
      const response = await grade_sheets.generatePDF(levelId, academicYear, studentId);
      console.log('PDF Response:', JSON.stringify(response, null, 2));
      if (!response.view_url) throw new Error('No PDF URL returned from server');
      setPdfUrls((prev) => ({ ...prev, [key]: response.view_url }));
      window.open(response.view_url, '_blank');
      toast.success('PDF generated and opened!');
    } catch (err: any) {
      console.error('PDF Generation Error:', JSON.stringify({
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      }, null, 2));
      toast.error(`Failed to generate PDF: ${err.message || 'Unknown error'}`);
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