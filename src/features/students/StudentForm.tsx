import React, { useState } from 'react';
import type { Student } from '../../types/student';

type Props = {
  initialData?: Student;
  onSubmit?: (data: Student) => void;
};

const StudentForm: React.FC<Props> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    dob: initialData?.dob || '',
    gender:
      initialData?.gender === 'M'
        ? 'Male'
        : initialData?.gender === 'F'
        ? 'Female'
        : initialData?.gender === 'O'
        ? 'Other'
        : '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      // Only submit if gender is valid
      let gender: 'M' | 'F' | 'O' | undefined;
      if (formData.gender === 'Male') gender = 'M';
      else if (formData.gender === 'Female') gender = 'F';
      else if (formData.gender === 'Other') gender = 'O';

      if (gender) {
        const payload: Student = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          dob: formData.dob,
          gender,
        };
        onSubmit(payload);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <input
        name="first_name"
        value={formData.first_name}
        onChange={handleChange}
        placeholder="First Name"
        className="border p-2 w-full"
      />

      <input
        name="last_name"
        value={formData.last_name}
        onChange={handleChange}
        placeholder="Last Name"
        className="border p-2 w-full"
      />

      <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        className="border p-2 w-full"
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      <input
        name="dob"
        value={formData.dob}
        onChange={handleChange}
        type="date"
        placeholder="Date of Birth"
        className="border p-2 w-full"
      />

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        {initialData ? 'Update' : 'Add'} Student
      </button>
    </form>
  );
};

export default StudentForm;
