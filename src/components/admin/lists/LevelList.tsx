import React, { useState } from 'react';
import { AdminList } from '../AdminList';
import Modal from '../../common/Modal';
import toast from 'react-hot-toast';
import type { Level } from '../../../types';

interface LevelListProps {
  levels: Level[];
  loading?: boolean;
  editLevel: (id: number, values: { name: string }) => Promise<void>;
  onDelete: (id: number) => void;
}

export const LevelList: React.FC<LevelListProps> = ({ levels, loading, editLevel, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [editedName, setEditedName] = useState('');

  const handleEditClick = (level: Level) => {
    console.log('Edit clicked for level:', level); // Debug: Confirm level data
    setSelectedLevel(level);
    setEditedName(level.name);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (selectedLevel && editedName.trim()) {
      console.log('Saving level:', { id: selectedLevel.id, name: editedName }); // Debug: Log payload
      try {
        await editLevel(selectedLevel.id, { name: editedName });
        toast.success('Level updated successfully');
        setIsModalOpen(false);
        setSelectedLevel(null);
        setEditedName('');
      } catch (error) {
        console.error('Error in handleSave:', error); // Debug: Log full error
        toast.error('Failed to update level');
      }
    } else {
      toast.error('Level name is required');
    }
  };

  const handleClose = () => {
    console.log('Modal closed'); // Debug: Confirm modal close
    setIsModalOpen(false);
    setSelectedLevel(null);
    setEditedName('');
  };

  const columns = ['ID', 'Name', 'Actions'];
  const data = levels.map((level) => [
    level.id.toString(),
    level.name,
    <div className="flex space-x-2">
      <button
        onClick={() => handleEditClick(level)}
        className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(level.id)}
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
          <h2 className="text-xl font-bold mb-4">Edit Level</h2>
          <div className="mb-4">
            <label htmlFor="levelName" className="block text-sm font-medium text-gray-700">
              Level Name
            </label>
            <input
              id="levelName"
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter level name"
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
              disabled={!editedName.trim()}
            >
              Save
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};