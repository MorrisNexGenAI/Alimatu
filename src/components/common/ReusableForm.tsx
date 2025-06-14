import React, { useState } from 'react';
import Select from './Select';

interface Field {
  name: string;
  label: string;
  type: 'text' | 'date' | 'select';
  options?: { value: string | number; label: string }[];
}

interface ReusableFormProps {
  fields: Field[];
  initialValues: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const ReusableForm: React.FC<ReusableFormProps> = ({ fields, initialValues, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialValues);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="grid gap-4 sm:grid-cols-2 mb-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium">{field.label}</label>
            {field.type === 'select' ? (
              <Select
                value={formData[field.name]?.toString() || ''}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                options={field.options || []}
                disabled={loading} label={''}              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                className="mt-1 block w-full border rounded p-2"
                disabled={loading}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ReusableForm;