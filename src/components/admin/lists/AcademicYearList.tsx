import React from 'react';
import { AdminList } from '../AdminList';
import type { AcademicYear } from '../../types/index';

interface AcademicYearsListProps {
  academicYears: AcademicYear[];
  onEdit: (year: AcademicYear) => void;
  onDelete: (id: number) => void;
}

export const AcademicYearsList: React.FC<AcademicYearsListProps> = ({ academicYears, onEdit, onDelete }) => {
  return (
    <AdminList
      columns={['Name', 'Start Date', 'End Date']}
      data={academicYears.map(year => [year.name, year.start_date, year.end_date])}
      actions={[
        { label: 'Edit', onClick: (index: number) => onEdit(academicYears[index]) },
        { label: 'Delete', onClick: (index: number) => onDelete(academicYears[index].id), className: 'text-red-500' },
      ]}
    />
  );
};