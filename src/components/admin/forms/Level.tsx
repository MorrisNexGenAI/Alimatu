import React from 'react';
import { useLevels } from '../../../hooks/useLevels';
import { AdminForm } from '../../../components/admin/AdminForm';
import { AdminList } from '../../../components/admin/AdminList';
import { bomiStyles } from '../../../templates/Bomi junior High/bomi';

export const LevelPage = () => {
  const { levels,  loading } = useLevels();

  return (
    <div className="container space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: bomiStyles.textColor }}>
        Manage Levels
      </h1>
     
      <div className="card">
        <AdminList
          columns={['Level Name']}
          data={levels.map((l) => [l.name])}
          loading={loading}
        />
      </div>
    </div>
  );
};