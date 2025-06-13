
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRefresh } from '../context/RefreshContext';
import { api } from '../api';
import { BASE_URL } from '../api/config';
import type { Level, Student, AcademicYear, GradeSheet } from '../types';
import Select from '../components/common/Select';
import BomiTheme from '../templates/Bomi junior High/bomi';
import './b_gradesheets.css';

const GradeSheetsPage: React.FC = () => {
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

      // Ensure full URL if relative
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

  if (loading && !selectedLevelId && !selectedAcademicYearId) return <p className="b-gradesheet-message">Loading data...</p>;

  return (
    <BomiTheme>
      <div className="b-gradesheet-page p-4">
        <h2 className="b-gradesheet-title">Grade Sheet Overview</h2>

        <div className="grid gap-4 sm:grid-cols-2 mb-4">
          <Select
            label="Level"
            value={selectedLevelId?.toString() || ''}
            onChange={handleLevelChange}
            options={[
              { value: '', label: 'Select Level' },
              ...levels.map((level) => ({
                value: level.id.toString(),
                label: level.name,
              })),
            ]}
            disabled={loading}
            error={errors.levels}
          />
          <Select
            label="Academic Year"
            value={selectedAcademicYearId?.toString() || ''}
            onChange={handleAcademicYearChange}
            options={[
              { value: '', label: 'Select Academic Year' },
              ...academicYears.map((year) => ({
                value: year.id.toString(),
                label: year.name,
              })),
            ]}
            disabled={loading}
            error={errors.academicYears}
          />
        </div>

        {selectedLevelId && selectedAcademicYearId && (
          <div className="mt-4">
            <button
              className="b-generate-btn p-2 bg-blue-500 text-white rounded flex items-center"
              onClick={() => handleGeneratePDF(selectedLevelId)}
              disabled={loading || pdfLoading[`level_${selectedLevelId}`]}
            >
              {pdfLoading[`level_${selectedLevelId}`] ? (
                <>
                  <span className="animate-spin mr-2">⌀</span>
                  Generating...
                </>
              ) : (
                'Generate PDF for Level'
              )}
            </button>
            {pdfUrls[`level_${selectedLevelId}`] && (
              <p className="mt-2">
                <a
                  href={pdfUrls[`level_${selectedLevelId}`]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Level PDF
                </a>
              </p>
            )}
          </div>
        )}

        {selectedLevelId && selectedAcademicYearId && !loading && (
          <div>
            {students.length > 0 ? (
              students.map((student) => {
                const gradeSheet: GradeSheet = gradeSheets.find((sheet) => sheet.student_id === student.id) || {
                  student_id: student.id,
                  student_name: `${student.firstName} ${student.lastName}`,
                  subjects: [],
                };
                return (
                  <div key={student.id} className="mb-6">
                    <h3 className="b-student-title">{gradeSheet.student_name}'s Grade Sheet</h3>
                    <button
                      className="b-generate-btn p-2 bg-gray-500 text-white rounded flex items-center"
                      onClick={() => handleGeneratePDF(selectedLevelId, student.id)}
                      disabled={loading || pdfLoading[`student_${student.id}`]}
                    >
                      {pdfLoading[`student_${student.id}`] ? (
                        <>
                          <span className="animate-spin mr-2">⌀</span>
                          Generating...
                        </>
                      ) : (
                        `Generate PDF for ${student.firstName} ${student.lastName}`
                      )}
                    </button>
                    {pdfUrls[`student_${student.id}`] && (
                      <p className="mt-2">
                        <a
                          href={pdfUrls[`student_${student.id}`]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          View Student PDF
                        </a>
                      </p>
                    )}
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border p-2">Subjects</th>
                          <th className="border p-2">1st Period</th>
                          <th className="border p-2">2nd Period</th>
                          <th className="border p-2">3rd Period</th>
                          <th className="border p-2">1st Exam</th>
                          <th className="border p-2">1st Semester Avg</th>
                          <th className="border p-2">4th Period</th>
                          <th className="border p-2">5th Period</th>
                          <th className="border p-2">6th Period</th>
                          <th className="border p-2">2nd Exam</th>
                          <th className="border p-2">2nd Semester Avg</th>
                          <th className="border p-2">Final Avg</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gradeSheet.subjects.map((subjectData) => (
                          <tr key={subjectData.subject_id} className="border">
                            <td className="p-2">{subjectData.subject_name}</td>
                            <td className="p-2 text-center">{subjectData['1st'] || '-'}</td>
                            <td className="p-2 text-center">{subjectData['2nd'] || '-'}</td>
                            <td className="p-2 text-center">{subjectData['3rd'] || '-'}</td>
                            <td className="p-2 text-center">{subjectData['1exam'] || '-'}</td>
                            <td className="p-2 text-center">{subjectData.sem1_avg || '-'}</td>
                            <td className="p-2 text-center">{subjectData['4th'] || '-'}</td>
                            <td className="p-2 text-center">{subjectData['5th'] || '-'}</td>
                            <td className="p-2 text-center">{subjectData['6th'] || '-'}</td>
                            <td className="p-2 text-center">{subjectData['2exam'] || '-'}</td>
                            <td className="p-2 text-center">{subjectData.sem2_avg || '-'}</td>
                            <td className="p-2 text-center">{subjectData.final_avg || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })
            ) : (
              <p className="b-gradesheet-message">
                {errors.students || errors.grades || 'No students found for this level and academic year'}
              </p>
            )}
          </div>
        )}

        {loading && selectedLevelId && selectedAcademicYearId && (
          <p className="b-gradesheet-message">Loading gradesheets...</p>
        )}
        {(!selectedLevelId || !selectedAcademicYearId) && (
          <p className="b-gradesheet-message">Please select a level and academic year</p>
        )}
      </div>
    </BomiTheme>
  );
};

export default GradeSheetsPage;