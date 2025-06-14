import React from 'react';
import { useStudentManagement } from '../../../hooks/useStudentManagement';
import Select from '../../../components/common/Select';
import Modal from '../../../components/common/Modal';
import BomiTheme from '../bomi';
import './b_studentManagement.css';

const BStudentManagementPage: React.FC = () => {
  const {
    academicYears,
    selectedAcademicYear,
    setSelectedAcademicYear,
    levels,
    selectedLevelId,
    setSelectedLevelId,
    students,
    loading,
    loadingLevels,
    loadingAcademicYears,
    selectedStudent,
    setSelectedStudent,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleEdit,
    handleDelete,
    handleSaveEdit,
    handleConfirmDelete,
    getLevelName,
  } = useStudentManagement();

  return (
    <BomiTheme>
      <div className="b-student-management-page p-4">
        <h1 className="b-student-management-heading text-2xl font-bold mb-4">Student Management</h1>

        {loadingAcademicYears || loadingLevels ? (
          <p className="b-student-management-message">Loading filters...</p>
        ) : (
          <div className="b-filters mb-4 flex gap-4">
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
          <p className="b-student-management-message">Loading students...</p>
        ) : (
          <table className="b-student-table w-full border-collapse">
            <thead>
              <tr className="b-table-header bg-gray-200">
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
                  <td className="border p-2">
                    {typeof student.academic_year === 'object' && student.academic_year !== null
                      ? student.academic_year.name
                      : ''}
                  </td>
                  <td className="border p-2">
                    <button className="b-edit-btn bg-blue-500 text-white p-1 rounded mr-2" onClick={() => handleEdit(student)}>
                      Edit
                    </button>
                    <button className="b-delete-btn bg-red-500 text-white p-1 rounded" onClick={() => handleDelete(student)}>
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
            <h2 className="b-modal-heading text-xl mb-2">Edit Student</h2>
            <div className="mb-4">
              <label className="block">First Name</label>
              <input
                type="text"
                value={selectedStudent.firstName}
                onChange={(e) => setSelectedStudent({ ...selectedStudent, firstName: e.target.value })}
                className="b-input border p-1 w-full"
              />
            </div>
            <div className="mb-4"> {/* Fixed classNameName typo */}
              <label className="block">Last Name</label>
              <input
                type="text"
                value={selectedStudent.lastName}
                onChange={(e) => setSelectedStudent({ ...selectedStudent, lastName: e.target.value })}
                className="b-input border p-1 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block">Gender</label>
              <select
                value={selectedStudent.gender}
                onChange={(e) => setSelectedStudent({ ...selectedStudent, gender: e.target.value as 'M' | 'F' | 'O' })}
                className="b-select border p-1 w-full"
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
                className="b-input border p-1 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block">Level</label>
              <select
                value={selectedStudent.level_id}
                onChange={(e) => setSelectedStudent({ ...selectedStudent, level_id: parseInt(e.target.value) })}
                className="b-select border p-1 w-full"
              >
                {levels.map((level) => (
                  <option key={level.id} value={level.id}>{level.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block">Academic Year</label>
              <select
                value={
                  typeof selectedStudent.academic_year === 'object' && selectedStudent.academic_year !== null
                    ? selectedStudent.academic_year.id.toString()
                    : selectedStudent.academic_year
                      ? selectedStudent.academic_year.toString()
                      : ''
                }
                onChange={(e) => setSelectedStudent({
                  ...selectedStudent,
                  academic_year: academicYears.find((year) => year.id === parseInt(e.target.value)) || selectedStudent.academic_year,
                })}
                className="b-select border p-1 w-full"
              >
                {academicYears.map((year) => (
                  <option key={year.id} value={year.id}>{year.name}</option>
                ))}
              </select>
            </div>
            <button className="b-save-btn bg-blue-500 text-white p-2 rounded" onClick={handleSaveEdit} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && selectedStudent && (
          <Modal onClose={() => setIsDeleteModalOpen(false)}>
            <h2 className="b-modal-heading text-xl mb-2">Confirm Delete</h2>
            <p className="b-modal-message">Are you sure you want to delete {`${selectedStudent.firstName} ${selectedStudent.lastName}`}?</p>
            <div className="mt-4">
              <button className="b-confirm-delete-btn bg-red-500 text-white p-2 rounded mr-2" onClick={handleConfirmDelete} disabled={loading}>
                {loading ? 'Deleting...' : 'Yes'}
              </button>
              <button className="b-cancel-btn bg-gray-500 text-white p-2 rounded" onClick={() => setIsDeleteModalOpen(false)}>
                No
              </button>
            </div>
          </Modal>
        )}
      </div>
    </BomiTheme>
  );
};

export default BStudentManagementPage;