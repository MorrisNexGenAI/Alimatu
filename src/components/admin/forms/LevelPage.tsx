import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthProvider';
import { useLevels } from '../../../hooks/useLevels';
import { LevelsForm } from './Level';
import { LevelsList } from '../lists/LevelList';
import { bomiStyles } from '../../../templates/Bomi junior High/bomi';

export const LevelPage: React.FC = () => {
  const { token } = useAuth();
  const { levels, loading, error, addLevel, editLevel, removeLevel } = useLevels(token || '');
  const [editingLevel, setEditingLevel] = useState<Level | null>(null);

  const handleAdd = () => {
    setEditingLevel(null);
  };

  const handleEdit = (level: Level) => {
    setEditingLevel(level);
  };

  return (
    <div className="container space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: bomiStyles.textColor }}>
        Manage Levels
      </h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="card">
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white p-2 rounded mb-4"
        >
          [+ Add Level]
        </button>
        {(editingLevel || !editingLevel) && (
          <LevelsForm
            initialData={editingLevel}
            onSubmit={(data) =>
              editingLevel ? editLevel(editingLevel.id, data) : addLevel(data)
            }
            onCancel={() => setEditingLevel(null)}
          />
        )}
        <LevelsList
          levels={levels}
          onEdit={handleEdit}
          onDelete={removeLevel}
          loading={loading}
        />
      </div>
    </div>
  );
};