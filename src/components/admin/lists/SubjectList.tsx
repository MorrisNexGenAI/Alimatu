import React from 'react';
import { AdminList } from '../AdminList';
import type { Level, Subject } from '../../../types';

interface SubjectListProps {
  subjects: Subject[];
  levels: Level[];
  loading?: boolean;
  onEdit: (subject: Subject) => void;
  onDelete: (id: number) => void;
}

export const SubjectList: React.FC<SubjectListProps> = ({
  subjects,
  levels,
  loading,
  onEdit,
  onDelete,
}) => {
  const columns = ['ID', 'Name', 'Level', 'Actions'];
  const data = subjects.map((subject) => [
    subject.id.toString(),
    subject.subject,
    levels.find((l) => l.id === subject.level_id)?.name || 'Unknown',
    <div className="flex space-x-2">
      <button
        onClick={() => onEdit(subject)}
        className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(subject.id)}
        className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Delete
      </button>
    </div>,
  ]);

  return <AdminList columns={columns} data={data} loading={loading} />;
};