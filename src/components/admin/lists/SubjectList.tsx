import React from 'react';
import { AdminList } from '../AdminList';
import type { Subject } from '../../types/index';

interface SubjectsListProps {
  subjects: Subject[];
  onEdit: (subject: Subject) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
}

export const SubjectsList: React.FC<SubjectsListProps> = ({ subjects, onEdit, onDelete, loading }) => {
  return (
    <AdminList
      columns={['Subject', 'Level']}
      data={subjects.map(subject => [subject.subject, subject.level_id.toString()])}
      actions={[
        { label: 'Edit', onClick: (index: number) => onEdit(subjects[index]) },
        { label: 'Delete', onClick: (index: number) => onDelete(subjects[index].id), className: 'text-red-500' },
      ]}
      loading={loading}
    />
  );
};