// C:\Users\USER\Desktop\GradeSheet\SchoolGradesSystem\src\pages\GradeSheetsPage.tsx
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRefresh } from '../context/RefreshContext';
import { api } from '../api';
import type { Level, Student } from '../types';
import type { GradeSheet } from '../api/grade_sheets';
import Select from '../components/common/Select';
import BomiTheme from '../templates/Bomi junior High/bomi';
import './b_gradesheets.css'; // Import the new CSS file

const GradeSheetsPage: React.FC = () => {
  const { refresh, setRefresh } = useRefresh();
  const [levels, setLevels] = useState<Level[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [gradeSheets, setGradeSheets] = useState<GradeSheet[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
      return;
    }

    const fetchLevelData = async () => {
      setLoading(true);
      try {
        const [studentData, gradesData] = await Promise.all([
          api.students.getStudentsByLevel(selectedLevelId),
          api.grade_sheets.getGradesByLevel(selectedLevelId),
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

  if (loading && !selectedLevelId) return <p className="b-gradesheet-message">Loading data...</p>;

  return (
    <BomiTheme>
      <div className="b-gradesheet-page p-4">
        <h2 className="b-gradesheet-heading">Grade Sheet Overview</h2>

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

        {selectedLevelId && !loading && (
          <div>
            {students.length > 0 ? (
              students.map((student) => {
                const gradeSheet = gradeSheets.find((sheet) => sheet.student_id === student.id) || {
                  student_id: student.id,
                  student_name: `${student.firstName} ${student.lastName}`,
                  subjects: [],
                };
                return (
                  <div key={student.id} className="mb-6">
                    <h3 className="b-student-heading">{gradeSheet.student_name}'s Grade Sheet</h3>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border p-2">Subjects</th>
                          <th className="border p-2">1st Period</th>
                          <th className="border p-2">2nd Period</th>
                          <th className="border p-2">3rd Period</th>
                          <th className="border p-2">1st Semester Exam</th>
                          <th className="border p-2">1st Semester Avg</th>
                          <th className="border p-2">4th Period</th>
                          <th className="border p-2">5th Period</th>
                          <th className="border p-2">6th Period</th>
                          <th className="border p-2">Final Exam</th>
                          <th className="border p-2">2nd Semester Avg</th>
                          <th className="border p-2">Final Avg</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gradeSheet.subjects.map((subjectData) => (
                          <tr key={subjectData.subject_id} className="border">
                            <td className="p-2">{subjectData.subject_name}</td>
                            <td className="p-2 text-center">{subjectData['1st'] ?? '-'}</td>
                            <td className="p-2 text-center">{subjectData['2nd'] ?? '-'}</td>
                            <td className="p-2 text-center">{subjectData['3rd'] ?? '-'}</td>
                            <td className="p-2 text-center">{subjectData['1exam'] ?? '-'}</td>
                            <td className="p-2 text-center">{subjectData.sem1_avg ?? '-'}</td>
                            <td className="p-2 text-center">{subjectData['4th'] ?? '-'}</td>
                            <td className="p-2 text-center">{subjectData['5th'] ?? '-'}</td>
                            <td className="p-2 text-center">{subjectData['6th'] ?? '-'}</td>
                            <td className="p-2 text-center">{subjectData['2exam'] ?? '-'}</td>
                            <td className="p-2 text-center">{subjectData.sem2_avg ?? '-'}</td>
                            <td className="p-2 text-center">{subjectData.final_avg ?? '-'}</td>
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