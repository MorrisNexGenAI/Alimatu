import React, { useState } from 'react';
import { AdminList } from '../AdminList';
import Modal from '../../common/Modal';
import toast from 'react-hot-toast';
import type { AcademicYear } from '../../../types';

interface AcademicYearListProps {
  academicYears: AcademicYear[];
  loading: boolean;
  editAcademicYear: (id: number, values: { name: string; start_date: string; end_date: string }) => Promise<void>;
  onDelete: (id: number) => void;
}

export const AcademicYearList: React.FC<AcademicYearListProps> = ({
  academicYears,
  loading,
  editAcademicYear,
  onDelete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<AcademicYear | null>(null);
  const [editedName, setEditedName] = useState('');
  const [editedStartDate, setEditedStartDate] = useState('');
  const [editedEndDate, setEditedEndDate] = useState('');

  const handleEditClick = (ay: AcademicYear) => {
    console.log('Edit clicked for academic year:', ay); // Debug
    setSelectedAcademicYear(ay);
    setEditedName(ay.name);
    setEditedStartDate(ay.start_date);
    setEditedEndDate(ay.end_date);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!selectedAcademicYear || !editedName.trim() || !editedStartDate || !editedEndDate) {
      toast.error('All fields are required');
      return;
    }
    const nameRegex = /^\d{4}\/\d{4}$/;
    if (!nameRegex.test(editedName)) {
      toast.error('Academic year name must be in YYYY/YYYY format (e.g., 2024/2025)');
      return;
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(editedStartDate) || !dateRegex.test(editedEndDate)) {
      toast.error('Dates must be in YYYY-MM-DD format');
      return;
    }
    const [startYear, endYear] = editedName.split('/').map(Number);
    const startDateYear = new Date(editedStartDate).getFullYear();
    const endDateYear = new Date(editedEndDate).getFullYear();
    if (startDateYear !== startYear || endDateYear !== endYear) {
      toast.error('Start and end dates must match the years in the name');
      return;
    }
    if (endYear !== startYear + 1) {
      toast.error('End year must be one year after start year');
      return;
    }
    if (new Date(editedEndDate) <= new Date(editedStartDate)) {
      toast.error('End date must be after start date');
      return;
    }
    try {
      console.log('Saving academic year:', { id: selectedAcademicYear.id, name: editedName, start_date: editedStartDate, end_date: editedEndDate }); // Debug
      await editAcademicYear(selectedAcademicYear.id, {
        name: editedName,
        start_date: editedStartDate,
        end_date: editedEndDate,
      });
      toast.success('Academic year updated successfully');
      setIsModalOpen(false);
      setSelectedAcademicYear(null);
      setEditedName('');
      setEditedStartDate('');
      setEditedEndDate('');
    } catch (error) {
      console.error('Error updating academic year:', error);
      toast.error('Failed to update academic year');
    }
  };

  const handleClose = () => {
    console.log('Modal closed'); // Debug
    setIsModalOpen(false);
    setSelectedAcademicYear(null);
    setEditedName('');
    setEditedStartDate('');
    setEditedEndDate('');
  };

  const columns = ['ID', 'Name', 'Start Date', 'End Date', 'Actions'];

  const data = academicYears.map((ay) => [
    ay.id.toString(),
    ay.name,
    ay.start_date,
    ay.end_date,
    <div key={ay.id} className="flex space-x-2">
      <button
        onClick={() => handleEditClick(ay)}
        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(ay.id)}
        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Delete
      </button>
    </div>,
  ]);

  return (
    <>
      <AdminList columns={columns} data={data} loading={loading} />
      {isModalOpen && (
        <Modal onClose={handleClose}>
          <h2 className="text-xl font-bold mb-4">Edit Academic Year</h2>
          <div className="mb-4">
            <label htmlFor="academicYearName" className="block text-sm font-medium text-gray-700">
              Name (YYYY/YYYY)
            </label>
            <input
              id="academicYearName"
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 2024/2025"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date (YYYY-MM-DD)
            </label>
            <input
              id="startDate"
              type="text"
              value={editedStartDate}
              onChange={(e) => setEditedStartDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 2024-09-01"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date (YYYY-MM-DD)
            </label>
            <input
              id="endDate"
              type="text"
              value={editedEndDate}
              onChange={(e) => setEditedEndDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 2025-06-30"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={!editedName.trim() || !editedStartDate || !editedEndDate}
            >
              Save
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};