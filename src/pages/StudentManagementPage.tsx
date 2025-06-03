import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRefresh } from '../context/RefreshContext';
import { api } from '../api';
import { Level, Student, AcademicYear } from '../types';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';
import './StudentManagementPage.css';

const StudentManagementPage: React.FC = () => {
  const { setRefresh } = useRefresh();
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingLevels, setLoadingLevels] = useState(true);
  const [loadingAcademicYears, setLoadingAcademicYears] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch academic years
  useEffect(() => {
    const fetchAcademicYears = async () => {
      setLoadingAcademicYears(true);
      try {
        const data = await api.academic_years.getAcademicYears();
        setAcademicYears(data);
        const currentYear = data.find((year) => year.name === '2025/2026');
        setSelectedAcademicYear(currentYear?.name || (data.length > 0 ? data[0].name : null));
      } catch (err) {
        toast.error('Failed to load academic years');
        setSelectedAcademicYear(null);
      } finally {
        setLoadingAcademicYears(false);
      }
    };
    fetchAcademicYears();
  }, []);

  // Fetch levels
  useEffect(() => {
    const fetchLevels = async () => {
      setLoadingLevels(true);
      try {
        const data = await api.levels.getLevels();
        setLevels(data);
        if (data.length > 0) setSelectedLevelId(data[0].id);
      } catch (err) {
        toast.error('Failed to load levels');
        setSelectedLevelId(null);
      } finally {
        setLoadingLevels(false);
      }
    };
    fetchLevels();
  }, []);

  // Fetch students based on academic year and level
  useEffect(() => {
    if (!selectedAcademicYear || !selectedLevelId) {
      setStudents([]);
      return;
    }
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const data = await api.students.getStudentsByLevel(selectedLevelId, selectedAcademicYear);
        console.log('Students Data:', data);
        setStudents(data || []);
      } catch (err) {
        toast.error('Failed to load students');
        console.error('Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [selectedAcademicYear, selectedLevelId]);

  // Handle edit
  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  // Handle delete confirmation
  const handleDelete = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  // Save edited student
  const handleSaveEdit = async () => {
    if (!selectedStudent) return;
    setLoading(true);
    try {
      await api.students.updateStudent(selectedStudent.id, {
        firstName: selectedStudent.firstName,
        lastName: selectedStudent.lastName,
        gender: selectedStudent.gender,
        dob: selectedStudent.dob,
        level: selectedStudent.level_id,
        academic_year: selectedStudent.academic_year.id,
      });
      toast.success('Student updated successfully');
      setIsEditModalOpen(false);
      setRefresh((prev) => (prev === 0 ? 1 : 0));
    } catch (err) {
      toast.error('Failed to update student');
      console.error('Update Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!selectedStudent) return;
    setLoading(true);
    try {
      await api.students.deleteStudent(selectedStudent.id);
      toast.success('Student deleted successfully');
      setIsDeleteModalOpen(false);
      setRefresh((prev) => (prev === 0 ? 1 : 0));
    } catch (err) {
      toast.error('Failed to delete student');
      console.error('Delete Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get level name from level_id
  const getLevelName = (levelId: number) => {
    const level = levels.find(l => l.id === levelId);
    return level ? level.name : 'Unknown';
  };

  return (
    <div className="student-management-page p-4">
      <h1 className="text-2xl font-bold mb-4">Student Management</h1>

      {loadingAcademicYears || loadingLevels ? (
        <p>Loading filters...</p>
      ) : (
        <div className="filters mb-4 flex gap-4">
          <Select
            label="Academic Year"
            value={selectedAcademicYear || ''}
            onChange={(e) => setSelectedAcademicYear(e.target.value)}
            options={academicYears.length > 0 ? academicYears.map((year) => ({ value: year.name, label: year.name })) : [{ value: '', label: 'No academic years available' }]}
          />
          <Select
            label="Level"
            value={selectedLevelId?.toString() ?? ''}
            onChange={(e) => setSelectedLevelId(parseInt(e.target.value) || null)}
            options={levels.length > 0 ? levels.map((level) => ({ value: level.id.toString(), label: level.name })) : [{ value: '', label: 'No levels available' }]}
          />
        </div>
      )}

      {loading ? (
        <p>Loading students...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Level</th>
              <th className="border p-2">Gender</th>
              <th className="border p-2">DOB</th>
              <th className="border p-2">Academic Year</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border">
                <td className="border p-2">{`${student.firstName} ${student.lastName}`}</td>
                <td className="border p-2">{`Level ${getLevelName(student.level_id)}`}</td>
                <td className="border p-2">{student.gender}</td>
                <td className="border p-2">{student.dob}</td>
                <td className="border p-2">{student.academic_year.name}</td>
                <td className="border p-2">
                  <button className="bg-blue-500 text-white p-1 rounded mr-2" onClick={() => handleEdit(student)}>
                    Edit
                  </button>
                  <button className="bg-red-500 text-white p-1 rounded" onClick={() => handleDelete(student)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedStudent && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <h2 className="text-xl mb-2">Edit Student</h2>
          <div className="mb-4">
            <label className="block">First Name</label>
            <input
              type="text"
              value={selectedStudent.firstName}
              onChange={(e) => setSelectedStudent({ ...selectedStudent, firstName: e.target.value })}
              className="border p-1 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block">Last Name</label>
            <input
              type="text"
              value={selectedStudent.lastName}
              onChange={(e) => setSelectedStudent({ ...selectedStudent, lastName: e.target.value })}
              className="border p-1 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block">Gender</label>
            <select
              value={selectedStudent.gender}
              onChange={(e) => setSelectedStudent({ ...selectedStudent, gender: e.target.value as 'M' | 'F' | 'O' })}
              className="border p-1 w-full"
            >
              <option value="M">M</option>
              <option value="F">F</option>
              <option value="O">O</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block">DOB</label>
            <input
              type="date"
              value={selectedStudent.dob}
              onChange={(e) => setSelectedStudent({ ...selectedStudent, dob: e.target.value })}
              className="border p-1 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block">Level</label>
            <select
              value={selectedStudent.level_id}
              onChange={(e) => setSelectedStudent({ ...selectedStudent, level_id: parseInt(e.target.value) })}
              className="border p-1 w-full"
            >
              {levels.map((level) => (
                <option key={level.id} value={level.id}>{level.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block">Academic Year</label>
            <select
              value={selectedStudent.academic_year.id.toString()}
              onChange={(e) => setSelectedStudent({
                ...selectedStudent,
                academic_year: academicYears.find((year) => year.id === parseInt(e.target.value)) || selectedStudent.academic_year,
              })}
              className="border p-1 w-full"
            >
              {academicYears.map((year) => (
                <option key={year.id} value={year.id}>{year.name}</option>
              ))}
            </select>
          </div>
          <button className="bg-blue-500 text-white p-2 rounded" onClick={handleSaveEdit} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedStudent && (
        <Modal onClose={() => setIsDeleteModalOpen(false)}>
          <h2 className="text-xl mb-2">Confirm Delete</h2>
          <p>Are you sure you want to delete {`${selectedStudent.firstName} ${selectedStudent.lastName}`}?</p>
          <div className="mt-4">
            <button className="bg-red-500 text-white p-2 rounded mr-2" onClick={handleConfirmDelete} disabled={loading}>
              {loading ? 'Deleting...' : 'Yes'}
            </button>
            <button className="bg-gray-500 text-white p-2 rounded" onClick={() => setIsDeleteModalOpen(false)}>
              No
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StudentManagementPage;