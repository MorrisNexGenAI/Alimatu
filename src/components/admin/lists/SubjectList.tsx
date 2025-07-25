import React, { useState } from 'react';
import { AdminList } from '../AdminList';
import Modal from '../../common/Modal';
import toast from 'react-hot-toast';
import type { Level, Subject } from '../../../types';

interface SubjectListProps {
  subjects: Subject[];
  levels: Level[];
  loading?: boolean;
  updateSubject: (id: number, values: { subject: string; level_id: number }) => Promise<void>;
  onDelete: (id: number) => void;
}

export const SubjectList: React.FC<SubjectListProps> = ({
  subjects,
  levels,
  loading,
  updateSubject,
  onDelete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [editedSubject, setEditedSubject] = useState('');
  const [editedLevelId, setEditedLevelId] = useState('');

  const handleEditClick = (subject: Subject) => {
    console.log('Edit clicked for subject:', subject); // Debug
    setSelectedSubject(subject);
    setEditedSubject(subject.subject);
    setEditedLevelId(subject.level_id.toString());
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!selectedSubject || !editedSubject.trim() || !editedLevelId || isNaN(parseInt(editedLevelId))) {
      toast.error('Subject name and level are required');
      return;
    }
    try {
      console.log('Saving subject:', { id: selectedSubject.id, subject: editedSubject, level_id: parseInt(editedLevelId) }); // Debug
      await updateSubject(selectedSubject.id, {
        subject: editedSubject,
        level_id: parseInt(editedLevelId),
      });
      toast.success('Subject updated successfully');
      setIsModalOpen(false);
      setSelectedSubject(null);
      setEditedSubject('');
      setEditedLevelId('');
    } catch (error) {
      console.error('Error updating subject:', error);
      toast.error('Failed to update subject');
    }
  };

  const handleClose = () => {
    console.log('Modal closed'); // Debug
    setIsModalOpen(false);
    setSelectedSubject(null);
    setEditedSubject('');
    setEditedLevelId('');
  };

  const columns = ['ID', 'Name', 'Level', 'Actions'];
  const data = subjects.map((subject) => [
    subject.id.toString(),
    subject.subject,
    levels.find((l) => l.id === subject.level_id)?.name || 'Unknown',
    <div className="flex space-x-2">
      <button
        onClick={() => handleEditClick(subject)}
        className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(subject.id)}
        className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
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
          <h2 className="text-xl font-bold mb-4">Edit Subject</h2>
          <div className="mb-4">
            <label htmlFor="subjectName" className="block text-sm font-medium text-gray-700">
              Subject Name
            </label>
            <input
              id="subjectName"
              type="text"
              value={editedSubject}
              onChange={(e) => setEditedSubject(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter subject name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="levelId" className="block text-sm font-medium text-gray-700">
              Level
            </label>
            <select
              id="levelId"
              value={editedLevelId}
              onChange={(e) => setEditedLevelId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a Level</option>
              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
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
              disabled={!editedSubject.trim() || !editedLevelId}
            >
              Save
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};