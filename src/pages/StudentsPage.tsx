import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api';
import type { Level, Student } from '../types';
import Select from '../components/common/Select';
import StudentForm from '../components/students/StudentForm';
import StudentList from '../components/students/StudentList';

const StudentPage: React.FC = () => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
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
      return;
    }

    const fetchStudents = async () => {
      setLoading(true);
      try {
        const studentData = await api.students.getStudentsByLevel(selectedLevelId);
        setStudents(studentData);
        setErrors((prev) => ({ ...prev, students: '' }));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load students';
        toast.error(message);
        setErrors((prev) => ({ ...prev, students: message }));
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [selectedLevelId]);

  const handleStudentAdded = (newStudent: Student) => {
    setStudents((prev) => [...prev, newStudent]);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Add Students</h2>

      <Select
        label="Level"
        value={selectedLevelId?.toString() || ''}
        onChange={(e) => setSelectedLevelId(Number(e.target.value) || null)}
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
        <>
          <StudentForm levelId={selectedLevelId} onStudentAdded={handleStudentAdded} />
          <StudentList students={students} error={errors.students} />
        </>
      )}

      {loading && selectedLevelId && <p className="text-center">Loading students...</p>}
      {!selectedLevelId && <p className="text-center">Please select a level</p>}
    </div>
  );
};

export default StudentPage;