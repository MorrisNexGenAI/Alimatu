import React from 'react';
import { AdminForm } from '../AdminForm';

interface SubjectFormProps {
  levels: { id: number; name: string }[];
  onSubmit: (values: Record<string, string>) => void;
  disabled?: boolean;
  loading?: boolean;
  initialValues?: Record<string, string>;
}

// Why: Creates a form for subjects with a required select field for level_id to prevent NOT NULL errors
export const SubjectForm: React.FC<SubjectFormProps> = ({
  levels,
  onSubmit,
  disabled,
  loading,
  initialValues,
}) => {
  // Why: Define fields for subject (text) and level_id (select), with required validation
  const fields = [
    { name: 'subject', label: 'Subject Name', type: 'text' as const, required: true },
    {
      name: 'level_id',
      label: 'Level',
      type: 'select' as const,
      options: [
        { value: '', label: 'Select a Level', disabled: true }, // Placeholder
        ...levels.map((level) => ({
          value: level.id.toString(),
          label: level.name,
        })),
      ],
      required: true, // Why: Ensures level_id is selected
    },
  ];

  // Why: Set default level_id if levels exist and not editing, to avoid empty submissions
  const defaultValues = initialValues || {
    subject: '',
    level_id: levels.length > 0 ? levels[0].id.toString() : '',
  };

  // Why: Pass fields, default values, and props to AdminForm, which handles form logic
  return (
    <div className="border border-red-500 p-4"> {/* Why: Debug visibility */}
      <AdminForm
        fields={fields}
        onSubmit={(values) => {
          // Why: Validate required fields before submission
          if (!values.subject) {
            alert('Subject name is required');
            return;
          }
          if (!values.level_id || isNaN(parseInt(values.level_id))) {
            alert('Please select a valid level');
            return;
          }
          console.log('SubjectForm Submit:', values); // Why: Debug payload
          onSubmit(values);
        }}
        disabled={disabled}
        loading={loading}
        initialValues={defaultValues}
      />
    </div>
  );
};