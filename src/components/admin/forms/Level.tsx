import React from 'react';
import { AdminForm } from '../AdminForm';

interface LevelFormProps {
  onSubmit: (values: { name: string }) => void;
  disabled?: boolean;
  loading?: boolean;
  initialValues?: { name: string };
}

export const LevelForm: React.FC<LevelFormProps> = ({
  onSubmit,
  disabled,
  loading,
  initialValues,
}) => {
  const fields = [
    { name: 'name', label: 'Level Name', type: 'text' as const },
  ];

  return (
    <AdminForm
      fields={fields}
      onSubmit={onSubmit}
      disabled={disabled}
      loading={loading}
      initialValues={initialValues}
    />
  );
};