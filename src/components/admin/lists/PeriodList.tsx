import React from 'react';
import { AdminList } from '../AdminList';
import { Period } from '../../../types';

interface PeriodListProps {
  periods: Period[];
  loading: boolean;
  onEdit: (period: Period) => void;
  onDelete: (id: number) => void;
}

export const PeriodList: React.FC<PeriodListProps> = ({
  periods,
  loading,
  onEdit,
  onDelete,
}) => {
  const columns = ['ID', 'Period', 'Actions'];

  const data = periods.map((p) => [
    p.id.toString(),
    p.period,
    <div key={p.id} className="flex space-x-2">
      <button
        onClick={() => onEdit(p)}
        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(p.id)}
        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Delete
      </button>
    </div>,
  ]);

  return <AdminList columns={columns} data={data} loading={loading} />;
};