import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface StudentFormProps {
  levelId: number;
  academicYearId: number;
  onStudentAdded: (data: {
    firstName: string;
    lastName: string;
    gender: 'M' | 'F' | 'O';
    dob: string;
  }) => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ levelId, academicYearId, onStudentAdded }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '' as 'M' | 'F' | 'O' | '',
    dob: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.gender || !formData.dob) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!levelId || !academicYearId) {
      toast.error('Level and academic year must be selected');
      return;
    }
    onStudentAdded({
      firstName: formData.firstName,
      lastName: formData.lastName,
      gender: formData.gender as 'M' | 'F' | 'O',
      dob: formData.dob,
    });
    setFormData({ firstName: '', lastName: '', gender: '', dob: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="b-student-form mb-4 p-4 border rounded">
      <h3 className="text-lg font-semibold mb-2">Add New Student</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 p-2 bg-blue-500 text-white rounded"
        disabled={!levelId || !academicYearId}
      >
        Add Student
      </button>
    </form>
  );
};

export default StudentForm;