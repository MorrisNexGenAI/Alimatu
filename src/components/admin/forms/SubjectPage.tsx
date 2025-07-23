import React, { useState } from 'react';
import { useSubjects } from '../../../hooks/useSubjects';
import { bomiStyles } from '../../../templates/Bomi junior High/bomi';
import type {Subject} from '../../../types/index'
export const SubjectPage: React.FC = () => {
  const {
    subjects,
    levels,
    selectedLevelId,
    handleLevelChange,
  } = useSubjects();
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const handleAdd = () => {
    setEditingSubject(null);
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
  };

  return (
    <div className="container space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: bomiStyles.textColor }}>
        Manage Subjects
      </h1>

      <div className="card">
        <label className="block mb-2 text-sm font-medium">Select Level:</label>
        <select
          value={selectedLevelId || ''}
          onChange={handleLevelChange}
          className="border p-2 rounded w-full"
        >
          <option value="">-- Choose Level --</option>
          {levels.map((level) => (
            <option key={level.id} value={level.id}>
              {level.name}
            </option>
          ))}
        </select>
      </div>
      <div className="card">
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white p-2 rounded mb-4"
        >
          [+ Add Subject]
        </button>
      </div>
    </div>
  );
};