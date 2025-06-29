import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRefresh } from '../context/RefreshContext';
import { api } from '../api';
import { grade_sheets } from '../api/grade_sheets';
import { type Level, type Student, type AcademicYear, type UseGradeSheetsReturn, type GradeSheet, type Subject, type Period, type PaginatedResponse, PdfLoading, PdfUrls } from '../types';

interface Errors {
  levels?: string;
  academicYears?: string;
  students?: string;
  grades?: string;
  periods?: string;
  subject?: string;
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

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setErrors({});
      try {
        const [levelResponse, academicYearResponse, periodResponse] = await Promise.all([
          api.levels.getLevels(),
          api.academic_years.getAcademicYears(),
          api.periods.getPeriods(),
        ]);

        let levelData: Level[] = [];
        if (Array.isArray(levelResponse)) {
          levelData = levelResponse;
        } else if (levelResponse && typeof levelResponse === 'object' && Array.isArray(levelResponse.results)) {
          levelData = levelResponse.results;
        } else {
          console.warn('Unexpected levelResponse format:', JSON.stringify(levelResponse, null, 2));
          throw new Error('Invalid levels response format');
        }

        let academicYearData: AcademicYear[] = [];
        if (Array.isArray(academicYearResponse)) {
          academicYearData = academicYearResponse;
        } else if (academicYearResponse && typeof academicYearResponse === 'object' && Array.isArray(academicYearResponse.results)) {
          academicYearData = academicYearResponse.results;
        } else {
          console.warn('Unexpected academicYearResponse format:', JSON.stringify(academicYearResponse, null, 2));
          throw new Error('Invalid academic years response format');
        }

        let periodData: Period[] = [];
        if (Array.isArray(periodResponse)) {
          periodData = periodResponse;
        } else if (periodResponse && typeof periodResponse === 'object' && Array.isArray(periodResponse.results)) {
          periodData = periodResponse.results;
        } else {
          console.warn('Unexpected periodResponse format:', JSON.stringify(periodResponse, null, 2));
          throw new Error('Invalid periods response format');
        }

        console.log('Processed Levels:', JSON.stringify(levelData, null, 2));
        console.log('Processed Academic Years:', JSON.stringify(academicYearData, null, 2));
        console.log('Processed Periods:', JSON.stringify(periodData, null, 2));

        setLevels(levelData);
        setAcademicYears(academicYearData);
        setPeriods(periodData);

        const currentYear = academicYearData.find((year) => year.name === '2024/2025');
        setSelectedAcademicYearId(currentYear?.id || academicYearData[0]?.id || null);
        if (levelData.length > 0) {
          setSelectedLevelId(levelData[0].id);
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
        const [studentResponse, gradesResponse, subjectResponse] = await Promise.all([
          api.students.getStudentsByLevel(selectedLevelId, academicYear),
          grade_sheets.getGradeSheetsByLevel(selectedLevelId, academicYear),
          api.subjects.getSubjects(selectedLevelId),
        ]);
        console.log('Raw Students Response:', JSON.stringify(studentResponse, null, 2));
        console.log('Raw GradeSheets Response:', JSON.stringify(gradesResponse, null, 2));
        console.log('Raw Subjects Response:', JSON.stringify(subjectResponse, null, 2));

        const studentsData = Array.isArray(studentResponse) ? studentResponse : [];
        const gradesData = Array.isArray(gradesResponse) ? gradesResponse : [];
        const subjectData = Array.isArray(subjectResponse) ? subjectResponse : [];

        setStudents(studentsData);
        setGradeSheets(gradesData);
        setSubjects(subjectData);

        console.log('Students Set:', JSON.stringify(studentsData, null, 2));
        console.log('GradeSheets Set:', JSON.stringify(gradesData, null, 2));
        console.log('Subjects Set:', JSON.stringify(subjectData, null, 2));

        if (studentsData.length === 0) {
          console.warn('No students found for level_id:', selectedLevelId, 'academic_year:', academicYear);
          setErrors((prev) => ({ ...prev, students: 'No enrolled students found' }));
        }
        if (gradesData.length === 0) {
          console.warn('No gradesheets found for level_id:', selectedLevelId, 'academic_year:', academicYear);
          setErrors((prev) => ({ ...prev, grades: 'No grades found for this level and academic year' }));
        }
        if (subjectData.length === 0) {
          console.warn('No subjects found for level_id:', selectedLevelId);
          setErrors((prev) => ({ ...prev, subject: 'No subjects found for this level' }));
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
    setPdfLoading((prev: any) => ({ ...prev, [key]: true }));
    try {
      const academicYear = academicYears.find((ay) => ay.id === selectedAcademicYearId)?.name.replace('-', '/');
      if (!academicYear) throw new Error('Invalid academic year selected');
      const response = await grade_sheets.generatePDF(levelId, academicYear, studentId);
      console.log('PDF Response:', JSON.stringify(response, null, 2));
      if (!response.view_url) throw new Error('No PDF URL returned from server');
      setPdfUrls((prev: any) => ({ ...prev, [key]: response.view_url }));
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
      setPdfLoading((prev: any) => ({ ...prev, [key]: false }));
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
    handleLevelChange,
    handleAcademicYearChange,
    handleGeneratePDF,
  };
};