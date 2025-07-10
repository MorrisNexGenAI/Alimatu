import React from 'react';
import { AdminList } from '../AdminList';
import type { Level } from '../../types/index';

interface LevelsListProps {
  levels: Level[];
  onEdit: (level: Level) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
}

export const LevelsList: React.FC<LevelsListProps> = ({ levels, onEdit, onDelete, loading }) => {
  return (
    <AdminList
      columns={['Level Name']}
      data={levels.map(level => [level.name])}
      actions={[
        { label: 'Edit', onClick: (index: number) => onEdit(levels[index]) },
        { label: 'Delete', onClick: (index: number) => onDelete(levels[index].id), className: 'text-red-500' },
      ]}
      loading={loading}
    />
  );
};