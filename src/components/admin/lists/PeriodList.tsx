import React from 'react';
import { AdminList } from '../AdminList';
import type { Period } from '../../types/index';

interface PeriodsListProps {
  periods: Period[];
  onEdit: (period: Period) => void;
  onDelete: (id: number) => void;
}

export const PeriodsList: React.FC<PeriodsListProps> = ({ periods, onEdit, onDelete }) => {
  return (
    <AdminList
      columns={['Period', 'Is Exam']}
      data={periods.map(period => [period.period, period.is_exam ? 'Yes' : 'No'])}
      actions={[
        { label: 'Edit', onClick: (index: number) => onEdit(periods[index]) },
        { label: 'Delete', onClick: (index: number) => onDelete(periods[index].id), className: 'text-red-500' },
      ]}
    />
  );
};