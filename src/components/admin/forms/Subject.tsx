import React from 'react';
import { AdminForm } from '../AdminForm';
import type { Subject } from '../../types/index';

interface SubjectsFormProps {
  initialData?: Subject;
  onSubmit: (data: { subject: string; level_id: number }) => void;
  onCancel?: () => void;
  levels: Level[];
  selectedLevelId: number | null;
}

export const SubjectsForm: React.FC<SubjectsFormProps> = ({ initialData, onSubmit, onCancel, levels, selectedLevelId }) => {
  const fields = [
    { name: 'subject', label: 'Subject Name', type: 'text' },
    {
      name: 'level_id',
      label: 'Level',
      type: 'select',
      options: levels.map(level => ({
        value: level.id.toString(),
        label: level.name,
      })),
    },
  ];

  return (
    <div className="p-4 bg-white rounded shadow">
      <AdminForm
        fields={fields}
        initialData={initialData}
        onSubmit={onSubmit}
        disabled={!selectedLevelId}
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