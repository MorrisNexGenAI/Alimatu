import React from 'react';
import { AdminList } from '../AdminList';
import type { Level } from '../../../types';

interface LevelListProps {
  levels: Level[];
  loading?: boolean;
  onEdit: (level: Level) => void;
  onDelete: (id: number) => void;
}

export const LevelList: React.FC<LevelListProps> = ({ levels, loading, onEdit, onDelete }) => {
  const columns = ['ID', 'Name', 'Actions'];
  const data = levels.map((level) => [
    level.id.toString(),
    level.name,
    <div className="flex space-x-2">
      <button
        onClick={() => onEdit(level)}
        className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(level.id)}
        className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Delete
      </button>
    </div>,
  ]);

  return <AdminList columns={columns} data={data} loading={loading} />;
};