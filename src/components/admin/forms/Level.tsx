import React from 'react';
import { AdminForm } from '../AdminForm';
import type { Level } from '../../types/index';

interface LevelsFormProps {
  initialData?: Level;
  onSubmit: (data: { name: string }) => void;
  onCancel?: () => void;
}

export const LevelsForm: React.FC<LevelsFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const fields = [
    { name: 'name', label: 'Level Name (e.g., 7)', type: 'text' },
  ];

  return (
    <div className="p-4 bg-white rounded shadow">
      <AdminForm
        fields={fields}
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
      {onCancel && (
        <button onClick={onCancel} className="mt-2 text-red-500">
          Cancel
        </button>
      )}
    </div>
  );
};