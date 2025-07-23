import React from 'react';
import { AdminList } from '../AdminList';
import { AcademicYear } from '../../../types';

interface AcademicYearListProps {
  academicYears: AcademicYear[];
  loading: boolean;
  onEdit: (academicYear: AcademicYear) => void;
  onDelete: (id: number) => void;
}

export const AcademicYearList: React.FC<AcademicYearListProps> = ({
  academicYears,
  loading,
  onEdit,
  onDelete,
}) => {
  const columns = ['ID', 'Name', 'Start Date', 'End Date', 'Actions'];

  const data = academicYears.map((ay) => [
    ay.id.toString(),
    ay.name,
    ay.start_date,
    ay.end_date,
    <div key={ay.id} className="flex space-x-2">
      <button
        onClick={() => onEdit(ay)}
        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(ay.id)}
        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Delete
      </button>
    </div>,
  ]);

  return <AdminList columns={columns} data={data} loading={loading} />;
};