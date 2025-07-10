import React from 'react';
import { AdminForm } from '../AdminForm';
import type { AcademicYear } from '../../types/index';

interface AcademicYearsFormProps {
  initialData?: AcademicYear;
  onSubmit: (data: { name: string; start_date: string; end_date: string }) => void;
  onCancel?: () => void;
}

export const AcademicYearsForm: React.FC<AcademicYearsFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const fields = [
    { name: 'name', label: 'Academic Year (e.g., 2024/2025)', type: 'text' },
    { name: 'start_date', label: 'Start Date', type: 'date' },
    { name: 'end_date', label: 'End Date', type: 'date' },
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