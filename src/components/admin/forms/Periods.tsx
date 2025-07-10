import React from 'react';
import { AdminForm } from '../AdminForm';
import type { Period } from '../../types/index';

interface PeriodsFormProps {
  initialData?: Period;
  onSubmit: (data: { period: string }) => void;
  onCancel?: () => void;
}

export const PeriodsForm: React.FC<PeriodsFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const fields = [
    {
      name: 'period',
      label: 'Period',
      type: 'select',
      options: [
        { value: '1st', label: '1st Period' },
        { value: '2nd', label: '2nd Period' },
        { value: '3rd', label: '3rd Period' },
        { value: '1exam', label: '1st Semester Exam' },
        { value: '4th', label: '4th Period' },
        { value: '5th', label: '5th Period' },
        { value: '6th', label: '6th Period' },
        { value: '2exam', label: '2nd Semester Exam' },
      ],
    },
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