import React, { useState } from 'react';

type Student = {
  id?: number;
  name: string;
  age: number;
  grade: string;
};

type Props = {
  initialData?: Student;
  onSubmit?: (data: Student) => void;
};

const StudentForm: React.FC<Props> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState<Student>(
    initialData || { name: '', age: 0, grade: '' }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        className="border p-2 w-full"
      />
      <input
        name="age"
        type="number"
        value={formData.age}
        onChange={handleChange}
        placeholder="Age"
        className="border p-2 w-full"
      />
      <input
        name="grade"
        value={formData.grade}
        onChange={handleChange}
        placeholder="Grade"
        className="border p-2 w-full"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        {initialData ? 'Update' : 'Add'} Student
      </button>
    </form>
  );
};

export default StudentForm;
