import React, { useState } from 'react';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'date'; // Why: Add date type for AcademicYearForm
  options?: { value: string; label: string; disabled?: boolean }[];
  required?: boolean; // Why: Support required fields
}

interface AdminFormProps<T extends Record<string, string>> {
  fields: FormField[];
  onSubmit: (values: T) => void;
  disabled?: boolean;
  loading?: boolean;
  initialValues?: T;
}

// Why: Generic form component with support for date inputs and required field validation
export const AdminForm = <T extends Record<string, string>>({
  fields,
  onSubmit,
  disabled = false,
  loading = false,
  initialValues = {} as T,
}: AdminFormProps<T>) => {
  const [formValues, setFormValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  // Why: Handle input changes and clear errors for the field
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear error on change
  };

  // Why: Validate required fields and date formats before submission
  const validate = () => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    fields.forEach((field) => {
      const value = formValues[field.name];
      if (field.required && !value) {
        newErrors[field.name as keyof T] = `${field.label} is required`;
      }
      if (field.type === 'date' && value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        newErrors[field.name as keyof T] = `${field.label} must be in YYYY-MM-DD format`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Why: Prevent submission if validation fails
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled && !loading && validate()) {
      console.log('AdminForm Submit:', formValues); // Why: Debug payload
      onSubmit(formValues);
      if (!initialValues || Object.keys(initialValues).length === 0) {
        setFormValues({} as T); // Reset form for create mode
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <label className="mb-1 text-sm font-medium">{field.label}</label>
          {field.type === 'textarea' ? (
            <textarea
              name={field.name}
              value={formValues[field.name] || ''}
              onChange={handleChange}
              className={`border p-2 rounded-md focus:ring-2 focus:ring-blue-500 ${
                errors[field.name] ? 'border-red-500' : ''
              }`}
              disabled={disabled || loading}
              required={field.required} // Why: Enforce required in HTML
            />
          ) : field.type === 'select' ? (
            <select
              name={field.name}
              value={formValues[field.name] || ''}
              onChange={handleChange}
              className={`border p-2 rounded-md focus:ring-2 focus:ring-blue-500 ${
                errors[field.name] ? 'border-red-500' : ''
              }`}
              disabled={disabled || loading}
              required={field.required}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((option) => (
                <option value={option.value} key={option.value} disabled={option.disabled}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type} // Why: Support date type
              name={field.name}
              value={formValues[field.name] || ''}
              onChange={handleChange}
              className={`border p-2 rounded-md focus:ring-2 focus:ring-blue-500 ${
                errors[field.name] ? 'border-red-500' : ''
              }`}
              disabled={disabled || loading}
              required={field.required}
            />
          )}
          {errors[field.name] && (
            <span className="text-red-500 text-sm">{errors[field.name]}</span>
          )}
        </div>
      ))}
      <button
        type="submit"
        disabled={disabled || loading}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Submitting...' : initialValues && Object.keys(initialValues).length > 0 ? 'Update' : 'Create'}
      </button>
    </form>
  );
};