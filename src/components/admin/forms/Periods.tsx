import React from 'react';
import { AdminForm } from '../AdminForm';

interface PeriodFormProps {
  onSubmit: (values: Record<string, string>) => void;
  disabled?: boolean;
  loading?: boolean;
  initialValues?: Record<string, string>;
}

export const PeriodForm: React.FC<PeriodFormProps> = ({
  onSubmit,
  disabled,
  loading,
  initialValues,
}) => {
  const fields = [
    { name: 'period', label: 'Period Name', type: 'text' as const },
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