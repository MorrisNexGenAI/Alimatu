import React, { useState } from 'react';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  options?: { value: string; label: string }[];
}

interface AdminFormProps {
  fields: FormField[];
  onSubmit: (values: Record<string, string>) => void;
  disabled?: boolean;
  loading?: boolean;
}

export const AdminForm: React.FC<AdminFormProps> = ({
  fields,
  onSubmit,
  disabled = false,
  loading = false,
}) => {
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled && !loading) {
      onSubmit(formValues);
      setFormValues({}); // Reset form after submission
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
              className="border p-2 rounded"
              disabled={disabled || loading}
            />
          ) : field.type === 'select' ? (
            <select
              name={field.name}
              value={formValues[field.name] || ''}
              onChange={handleChange}
              className="border p-2 rounded"
              disabled={disabled || loading}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              name={field.name}
              value={formValues[field.name] || ''}
              onChange={handleChange}
              className="border p-2 rounded"
              disabled={disabled || loading}
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        disabled={disabled || loading}
        className="px-4 py-2 rounded"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};