import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string | number; label: string }[];
  error?: string;
}

const Select: React.FC<SelectProps> = ({ label, options, error, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium">{label}</label>
    <select
      className="mt-1 block w-full border rounded p-2"
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
  </div>
);

export default Select;