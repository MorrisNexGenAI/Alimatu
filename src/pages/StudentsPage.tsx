// src/pages/StudentPage.tsx
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getLevels, getStudentsByLevel, addStudent } from '../api/api';
import type { Student } from '../types';
import type { Level } from '../types';

const StudentPage: React.FC = () => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<'M' | 'F' | 'O' | ''>('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Fetch levels on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setErrors({});
      try {
        const levelData = await getLevels().catch((err) => {
          setErrors((prev) => ({ ...prev, levels: err.message }));
          return [];
        });
        setLevels(levelData);
        console.log('Levels:', levelData);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load levels';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch students when level changes
  useEffect(() => {
    if (!selectedLevelId) {
      setStudents([]);
      return;
    }

    const fetchStudents = async () => {
      setLoading(true);
      try {
        const studentData = await getStudentsByLevel(selectedLevelId).catch((err) => {
          setErrors((prev) => ({ ...prev, students: err.message }));
          return [];
        });
        setStudents(
          studentData.map((student) => ({
            id: student.id,
            firstName: student.firstName,
            lastName: student.lastName,
            gender: student.gender || 'M',
            dob: student.dob || '',
            level_id: student.level?.id || student.level_id,
          }))
        );
        console.log('Students:', studentData);
        setErrors((prev) => ({ ...prev, students: '' }));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load students';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [selectedLevelId]);

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const levelId = Number(e.target.value) || null;
    setSelectedLevelId(levelId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !gender || !dob || !selectedLevelId) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const newStudent = await addStudent({
        firstName,
        lastName,
        gender: gender as 'M' | 'F' | 'O',
        dob,
        level: selectedLevelId,
      });

      setStudents((prev) => [
        ...prev,
        {
          id: newStudent.id,
          firstName: newStudent.firstName,
          lastName: newStudent.lastName,
          gender: newStudent.gender as 'M' | 'F' | 'O',
          dob: newStudent.dob,
          level_id: typeof newStudent.level === 'object' ? newStudent.level.id : newStudent.level,
        },
      ]);
      setFirstName('');
      setLastName('');
      setGender('');
      setDob('');
      toast.success('Student added and enrolled successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add student';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !selectedLevelId) return <p className="text-center">Loading data...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Add Students</h2>

      {/* Level Dropdown */}
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

      {/* Add Student Form */}
      {selectedLevelId && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="grid gap-4 sm:grid-cols-2 mb-4">
            <div>
              <label className="block text-sm font-medium">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 block w-full border rounded p-2"
                disabled={loading}
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 block w-full border rounded p-2"
                disabled={loading}
                placeholder="Enter last name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'M' | 'F' | 'O')}
                className="mt-1 block w-full border rounded p-2"
                disabled={loading}
              >
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="mt-1 block w-full border rounded p-2"
                disabled={loading}
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Student'}
          </button>
        </form>
      )}

      {/* List of Students */}
      {selectedLevelId && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Students in Level</h3>
          {students.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">First Name</th>
                  <th className="border p-2">Last Name</th>
                  <th className="border p-2">Gender</th>
                  <th className="border p-2">Date of Birth</th>
                  <th className="border p-2">Level ID</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border">
                    <td className="p-2">{student.firstName}</td>
                    <td className="p-2">{student.lastName}</td>
                    <td className="p-2">{student.gender}</td>
                    <td className="p-2">{student.dob}</td>
                    <td className="p-2 text-center">{student.level_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center">
              {errors.students || 'No students found for this level'}
            </p>
          )}
        </div>
      )}

      {loading && selectedLevelId && <p className="text-center">Loading students...</p>}
      {!selectedLevelId && <p className="text-center">Please select a level</p>}
    </div>
  );
};

export default StudentPage;