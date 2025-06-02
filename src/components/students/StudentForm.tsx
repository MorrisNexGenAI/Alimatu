import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../api';
import type { Student, AcademicYear } from '../../types';

interface StudentFormProps {
  levelId: number;
  onStudentAdded: (student: Student) => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ levelId, onStudentAdded }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<'M' | 'F' | 'O' | ''>('');
  const [dob, setDob] = useState('');
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingAcademicYears, setLoadingAcademicYears] = useState(true);

  useEffect(() => {
    const fetchAcademicYears = async () => {
      setLoadingAcademicYears(true);
      try {
        const data = await api.academic_years.getAcademicYears();
        setAcademicYears(data);
        const currentYear = data.find((year: { name: string; }) => year.name === '2025/2026');
        setSelectedAcademicYear(currentYear?.id || (data.length > 0 ? data[0].id : null));
      } catch (err) {
        toast.error('Failed to load academic years');
      } finally {
        setLoadingAcademicYears(false);
      }
    };
    fetchAcademicYears();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !gender || !dob || !selectedAcademicYear) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const newStudent = await api.students.addStudent({
        firstName,
        lastName,
        gender: gender as 'M' | 'F' | 'O',
        dob,
        level: levelId,
        academic_year: selectedAcademicYear,
      });
      onStudentAdded({
        id: newStudent.id,
        firstName: newStudent.firstName,
        lastName: newStudent.lastName,
        gender: newStudent.gender as 'M' | 'F' | 'O',
        dob: newStudent.dob,
        level_id: typeof newStudent.level === 'object' ? newStudent.level.id : newStudent.level,
        academic_year: newStudent.academic_year,
        level: undefined
      });
      setFirstName('');
      setLastName('');
      setGender('');
      setDob('');
      setSelectedAcademicYear(null);
      toast.success('Student added successfully');
    } catch (err) {
      toast.error('Failed to add student');
      console.error('Add Student Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="grid gap-4 sm:grid-cols-2 mb-4">
        <div>
          <label className="block text-sm font-medium">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
            disabled={loading || loadingAcademicYears}
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
            disabled={loading || loadingAcademicYears}
            placeholder="Enter last name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as 'M' | 'F' | 'O' | '')}
            className="mt-1 block w-full border rounded p-2"
            disabled={loading || loadingAcademicYears}
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
            disabled={loading || loadingAcademicYears}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Academic Year</label>
          {loadingAcademicYears ? (
            <p className="mt-1">Loading academic years...</p>
          ) : (
            <select
              value={selectedAcademicYear?.toString() ?? ''}
              onChange={(e) => setSelectedAcademicYear(parseInt(e.target.value) || null)}
              className="mt-1 block w-full border rounded p-2"
              disabled={loading || loadingAcademicYears}
            >
              <option value="">Select Academic Year</option>
              {academicYears.map((year) => (
                <option key={year.id} value={year.id}>{year.name}</option>
              ))}
            </select>
          )}
        </div>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={loading || loadingAcademicYears}
      >
        {loading ? 'Adding...' : 'Add Student'}
      </button>
    </form>
  );
};

export default StudentForm;