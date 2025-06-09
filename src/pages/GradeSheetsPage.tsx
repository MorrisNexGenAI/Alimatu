import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRefresh } from '../context/RefreshContext';
import { api } from '../api';
import { BASE_URL } from '../api/config';
import type { Level, Student } from '../types';
import type { GradeSheet } from '../types/index';
import Select from '../components/common/Select';
import BomiTheme from '../templates/Bomi junior High/bomi';
import './b_gradesheets.css';

const GradeSheetsPage: React.FC = () => {
  const { refresh, setRefresh } = useRefresh();
  const [levels, setLevels] = useState<Level[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [gradeSheets, setGradeSheets] = useState<GradeSheet[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [pdfUrls, setPdfUrls] = useState<{ [key: string]: string }>({});

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
      setGradeSheets([]);
      setPdfUrls({});
      return;
    }

    const fetchLevelData = async () => {
      setLoading(true);
      try {
        const [studentData, gradesData] = await Promise.all([
          api.students.getStudentsByLevel(selectedLevelId),
          api.grade_sheets.getGradeSheetsByLevel(selectedLevelId),
        ]);
        setStudents(studentData);
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
  }, [selectedLevelId, refresh]);

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const levelId = Number(e.target.value) || null;
    setSelectedLevelId(levelId);
    setRefresh((prev) => prev + 1);
  };

  const handleGeneratePDF = async (levelId: number, studentId?: number) => {
    try {
      const url = studentId
        ? `${BASE_URL}/api/grade_sheets/gradesheet/pdf/generate?level_id=${encodeURIComponent(levelId)}&student_id=${encodeURIComponent(studentId)}`
        : `${BASE_URL}/api/grade_sheets/gradesheet/pdf/generate?level_id=${encodeURIComponent(levelId)}`;
      const response = await fetch(url, { method: 'GET' });
      console.log('Generate PDF Response:', response.status, response.headers);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate PDF: ${response.statusText}, ${errorText}`);
      }
      const data = await response.json();
      console.log('PDF Response Data:', data);
      const key = studentId ? `student_${studentId}` : `level_${levelId}`;
      setPdfUrls((prev) => ({ ...prev, [key]: data.view_url }));
      toast.success('PDF generated successfully! Click the link to view.');
    } catch (err) {
      console.error('PDF generation error:', err);
      toast.error(`Failed to generate PDF: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (loading && !selectedLevelId) return <p className="b-gradesheet-message">Loading data...</p>;

  return (
    <BomiTheme>
      <div className="b-gradesheet-page p-4">
        <h2 className="b-gradesheet-title">Grade Sheet Overview</h2>

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

        {selectedLevelId && (
          <div className="mt-4">
            <button
              className="b-generate-btn p-2 bg-blue-500 text-white rounded"
              onClick={() => handleGeneratePDF(selectedLevelId)}
              disabled={loading}
            >
              Generate PDF for Level
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

        {selectedLevelId && !loading && (
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
                      className="b-generate-btn p-2 bg-gray-500 text-white rounded"
                      onClick={() => handleGeneratePDF(selectedLevelId, student.id)}
                      disabled={loading}
                    >
                      Generate PDF for {student.firstName} {student.lastName}
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
              <p className="b-gradesheet-message">{errors.students || errors.grades || 'No students found for this level'}</p>
            )}
          </div>
        )}

        {loading && selectedLevelId && <p className="b-gradesheet-message">Loading grades...</p>}
        {!selectedLevelId && <p className="b-gradesheet-message">Please select a level</p>}
      </div>
    </BomiTheme>
  );
};

export default GradeSheetsPage;
