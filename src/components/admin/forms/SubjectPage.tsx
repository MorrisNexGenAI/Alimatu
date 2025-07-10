import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthProvider';
import { useSubjects } from '../../../hooks/useSubjects';
import { SubjectsForm } from './Subject';
import { SubjectsList } from '../lists/SubjectList';
import { bomiStyles } from '../../../templates/Bomi junior High/bomi';

export const SubjectPage: React.FC = () => {
  const { token } = useAuth();
  const {
    subjects,
    levels,
    selectedLevelId,
    handleLevelChange,
    addSubject,
    editSubject,
    removeSubject,
    loading,
    error,
  } = useSubjects(token || '');
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
      {error && <p className="text-red-500">{error}</p>}
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
        {(editingSubject || !editingSubject) && (
          <SubjectsForm
            initialData={editingSubject}
            onSubmit={(data) =>
              editingSubject
                ? editSubject(editingSubject.id, { ...data, level_id: selectedLevelId! })
                : addSubject({ ...data, level_id: selectedLevelId! })
            }
            onCancel={() => setEditingSubject(null)}
            levels={levels}
            selectedLevelId={selectedLevelId}
          />
        )}
        <SubjectsList
          subjects={subjects}
          onEdit={handleEdit}
          onDelete={removeSubject}
          loading={loading}
        />
      </div>
    </div>
  );
};