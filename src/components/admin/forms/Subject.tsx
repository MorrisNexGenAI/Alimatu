import React from 'react';
import { AdminForm } from '../AdminForm';

interface SubjectFormProps {
  levels: { id: number; name: string }[];
  onSubmit: (values: Record<string, string>) => void;
  disabled?: boolean;
  loading?: boolean;
  initialValues?: Record<string, string>;
}

export const SubjectForm: React.FC<SubjectFormProps> = ({
  levels,
  onSubmit,
  disabled,
  loading,
  initialValues,
}) => {
  const fields = [
    { name: 'subject', label: 'Subject Name', type: 'text' as const, required: true },
    {
      name: 'level_id',
      label: 'Level',
      type: 'select' as const,
      options: [
        { value: '', label: 'Select a Level', disabled: true },
        ...levels.map((level) => ({
          value: level.id.toString(),
          label: level.name,
        })),
      ],
      required: true,
    },
  ];

  const defaultValues = initialValues || {
    subject: '',
    level_id: levels.length > 0 ? levels[0].id.toString() : '',
  };

  // Disable form if no levels are available
  const isFormDisabled = disabled || loading || levels.length === 0;

  return (
    <div className="border border-red-500 p-4">
      {levels.length === 0 && <p className="text-red-500">No levels available. Please try again later.</p>}
      <AdminForm
        fields={fields}
        onSubmit={(values) => {
          if (!values.subject) {
            alert('Subject name is required');
            return;
          }
          if (!values.level_id || isNaN(parseInt(values.level_id))) {
            alert('Please select a valid level');
            return;
          }
          console.log('SubjectForm Submit:', values);
          onSubmit(values);
        }}
        disabled={isFormDisabled}
        loading={loading}
        initialValues={defaultValues}
      />
    </div>
  );
};