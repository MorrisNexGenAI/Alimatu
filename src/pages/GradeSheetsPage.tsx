import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRefresh } from '../context/RefreshContext';
import { getLevels, getStudentsByLevel, getGradesByLevel } from '../api/api';

interface Level { id: number; name: string; }
interface Student { id: number; firstName: string; lastName: string; }
interface GradeSheet {
  student_id: number;
  student_name: string;
  subjects: {
    subject_id: number;
    subject_name: string;
    '1st': number | null;
    '2nd': number | null;
    '3rd': number | null;
    '1exam': number | null;
    '4th': number | null;
    '5th': number | null;
    '6th': number | null;
    '2exam': number | null;
    sem1_avg: number | null;
    sem2_avg: number | null;
    final_avg: number | null;
  }[];
}

const GradeSheetsPage: React.FC = () => {
  const { refresh, setRefresh } = useRefresh();
  const [levels, setLevels] = useState<Level[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [gradeSheets, setGradeSheets] = useState<GradeSheet[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Define the fixed 9 subjects in order
  const fixedSubjects = [
    "Mathematics",
    "English",
    "Science",
    "Civics",
    "History",
    "Geography",
    "RME",
    "Vocabulary",
    "Agriculture"
  ];

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setErrors({});
      try {
        const levelData = await getLevels();
        setLevels(levelData);
        console.log('Levels:', levelData);
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
          getStudentsByLevel(selectedLevelId),
          getGradesByLevel(selectedLevelId),
        ]);
        setStudents(studentData);

        const mappedGradeSheets = gradesData.map((gradeSheet: any) => ({
          ...gradeSheet,
          student_name: studentData.find((s) => s.id === gradeSheet.student_id)
            ? `${studentData.find((s) => s.id === gradeSheet.student_id)!.firstName} ${studentData.find((s) => s.id === gradeSheet.student_id)!.lastName}`
            : 'Unknown Student',
        }));

        setGradeSheets(mappedGradeSheets);
        console.log('Students:', studentData);
        console.log('Grade Sheets:', mappedGradeSheets);
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
    setRefresh(prev => prev + 1); // Trigger refresh on level change
  };

  if (loading && !selectedLevelId) return <p className="text-center">Loading data...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Grade Sheet Overview</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium">Level</label>
        <select
          value={selectedLevelId ?? ''}
          onChange={handleLevelChange}
          className="mt-1 block w-full border rounded p-2"
          disabled={loading}
        >
          <option value="">Select Level</option>
          {levels.map((level) => (
            <option key={level.id} value={level.id}>
              {level.name}
            </option>
          ))}
        </select>
        {errors.levels && <p className="text-red-600 text-sm mt-1">{errors.levels}</p>}
      </div>

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
                  <h3 className="text-lg font-semibold mb-2">{gradeSheet.student_name}'s Grade Sheet</h3>
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
                      {fixedSubjects.map((subjectName) => {
                        const subjectData = gradeSheet.subjects.find((s) => s.subject_name === subjectName) || {
                          subject_name: subjectName,
                          '1st': null,
                          '2nd': null,
                          '3rd': null,
                          '1exam': null,
                          '4th': null,
                          '5th': null,
                          '6th': null,
                          '2exam': null,
                          sem1_avg: null,
                          sem2_avg: null,
                          final_avg: null,
                        };
                        return (
                          <tr key={subjectName} className="border">
                            <td className="p-2">{subjectData.subject_name}</td>
                            <td className="p-2 text-center">{subjectData['1st'] !== null ? subjectData['1st'] : '-'}</td>
                            <td className="p-2 text-center">{subjectData['2nd'] !== null ? subjectData['2nd'] : '-'}</td>
                            <td className="p-2 text-center">{subjectData['3rd'] !== null ? subjectData['3rd'] : '-'}</td>
                            <td className="p-2 text-center">{subjectData['1exam'] !== null ? subjectData['1exam'] : '-'}</td>
                            <td className="p-2 text-center">{subjectData.sem1_avg !== null ? subjectData.sem1_avg : '-'}</td>
                            <td className="p-2 text-center">{subjectData['4th'] !== null ? subjectData['4th'] : '-'}</td>
                            <td className="p-2 text-center">{subjectData['5th'] !== null ? subjectData['5th'] : '-'}</td>
                            <td className="p-2 text-center">{subjectData['6th'] !== null ? subjectData['6th'] : '-'}</td>
                            <td className="p-2 text-center">{subjectData['2exam'] !== null ? subjectData['2exam'] : '-'}</td>
                            <td className="p-2 text-center">{subjectData.sem2_avg !== null ? subjectData.sem2_avg : '-'}</td>
                            <td className="p-2 text-center">{subjectData.final_avg !== null ? subjectData.final_avg : '-'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })
          ) : (
            <p className="text-center">
              {errors.students || errors.grades || 'No students found for this level'}
            </p>
          )}
        </div>
      )}

      {loading && selectedLevelId && <p className="text-center">Loading grades...</p>}
      {!selectedLevelId && <p className="text-center">Please select a level</p>}
    </div>
  );
};

export default GradeSheetsPage;