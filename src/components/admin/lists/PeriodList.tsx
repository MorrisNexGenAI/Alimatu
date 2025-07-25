import React, { useState } from 'react';
import { AdminList } from '../AdminList';
import Modal from '../../common/Modal';
import toast from 'react-hot-toast';
import type { Period } from '../../../types';

interface PeriodListProps {
  periods: Period[];
  loading: boolean;
  editPeriod: (id: number, values: { period: string }) => Promise<void>;
  onDelete: (id: number) => void;
}

export const PeriodList: React.FC<PeriodListProps> = ({
  periods,
  loading,
  editPeriod,
  onDelete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);
  const [editedPeriod, setEditedPeriod] = useState('');

  const handleEditClick = (period: Period) => {
    console.log('Edit clicked for period:', period); // Debug
    setSelectedPeriod(period);
    setEditedPeriod(period.period);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (selectedPeriod && editedPeriod.trim()) {
      try {
        console.log('Saving period:', { id: selectedPeriod.id, period: editedPeriod }); // Debug
        await editPeriod(selectedPeriod.id, { period: editedPeriod });
        toast.success('Period updated successfully');
        setIsModalOpen(false);
        setSelectedPeriod(null);
        setEditedPeriod('');
      } catch (error) {
        console.error('Error updating period:', error);
        toast.error('Failed to update period');
      }
    } else {
      toast.error('Period name is required');
    }
  };

  const handleClose = () => {
    console.log('Modal closed'); // Debug
    setIsModalOpen(false);
    setSelectedPeriod(null);
    setEditedPeriod('');
  };

  const columns = ['ID', 'Period', 'Actions'];

  const data = periods.map((p) => [
    p.id.toString(),
    p.period,
    <div key={p.id} className="flex space-x-2">
      <button
        onClick={() => handleEditClick(p)}
        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(p.id)}
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
          <h2 className="text-xl font-bold mb-4">Edit Period</h2>
          <div className="mb-4">
            <label htmlFor="periodName" className="block text-sm font-medium text-gray-700">
              Period Name
            </label>
            <input
              id="periodName"
              type="text"
              value={editedPeriod}
              onChange={(e) => setEditedPeriod(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter period name"
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
              disabled={!editedPeriod.trim()}
            >
              Save
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};