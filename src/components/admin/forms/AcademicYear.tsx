import React from 'react';
import { AdminForm } from '../AdminForm';

interface AcademicYearFormProps {
  onSubmit: (values: Record<string, string>) => void;
  disabled?: boolean;
  loading?: boolean;
  initialValues?: Record<string, string>;
}

// Why: Creates a form for academic years with date inputs and name validation matching Django model
export const AcademicYearForm: React.FC<AcademicYearFormProps> = ({
  onSubmit,
  disabled,
  loading,
  initialValues,
}) => {
  // Why: Use type: 'date' for YYYY-MM-DD, validate name as YYYY/YYYY
  const fields = [
    {
      name: 'name',
      label: 'Academic Year Name (e.g., 2024/2025)',
      type: 'text' as const,
      required: true,
    },
    {
      name: 'start_date',
      label: 'Start Date',
      type: 'date' as const,
      required: true,
    },
    {
      name: 'end_date',
      label: 'End Date',
      type: 'date' as const,
      required: true,
    },
  ];

  // Why: Set default values, ensuring valid initial state
  const defaultValues = initialValues || {
    name: '',
    start_date: '',
    end_date: '',
  };

  // Why: Validate fields to match Django model constraints
  return (
    <div className="border border-red-500 p-4"> {/* Why: Debug visibility */}
      <AdminForm
        fields={fields}
        onSubmit={(values) => {
          // Why: Validate name format (YYYY/YYYY)
          const nameRegex = /^\d{4}\/\d{4}$/;
          if (!values.name || !nameRegex.test(values.name)) {
            alert('Academic year name must be in YYYY/YYYY format (e.g., 2024/2025)');
            return;
          }
          // Why: Validate date format (YYYY-MM-DD)
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!values.start_date || !dateRegex.test(values.start_date)) {
            alert('Start date must be in YYYY-MM-DD format');
            return;
          }
          if (!values.end_date || !dateRegex.test(values.end_date)) {
            alert('End date must be in YYYY-MM-DD format');
            return;
          }
          // Why: Validate name years match date years and end year is start year + 1
          const [startYear, endYear] = values.name.split('/').map(Number);
          const startDateYear = new Date(values.start_date).getFullYear();
          const endDateYear = new Date(values.end_date).getFullYear();
          if (startDateYear !== startYear || endDateYear !== endYear) {
            alert('Start and end dates must match the years in the name');
            return;
          }
          if (endYear !== startYear + 1) {
            alert('End year must be one year after start year');
            return;
          }
          // Why: Validate end_date > start_date
          if (new Date(values.end_date) <= new Date(values.start_date)) {
            alert('End date must be after start date');
            return;
          }
          console.log('AcademicYearForm Submit:', values); // Why: Debug payload
          onSubmit(values);
        }}
        disabled={disabled}
        loading={loading}
        initialValues={defaultValues}
      />
    </div>
  );
};