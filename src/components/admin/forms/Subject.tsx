import React from 'react';
import { useSubjects } from '../../../hooks/useSubjects';
import { AdminForm } from '../../../components/admin/AdminForm';
import { AdminList } from '../../../components/admin/AdminList';

export const SubjectPage = () => {
  const {
    subjects,
    levels,
    selectedLevelId,
    handleLevelChange,
    createSubject,
    loading,
  } = useSubjects();

  return (
    <div className="container space-y-6">
      <h1 className="text-2xl font-bold">Manage Subjects</h1>

      {/* Level Selector */}
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

      {/* Form to Add Subject */}
      <div className="card">
        <AdminForm
          fields={[
            { name: 'subject', label: 'Subject Name', type: 'text' },
          ]}
          onSubmit={(values) =>
            createSubject({
              subject: values.subject,
              level_id: selectedLevelId!,
              level: selectedLevelId!, // Adjust based on your API requirements
            })
          }
          disabled={!selectedLevelId}
          loading={loading}
        />
      </div>

      {/* List of Subjects */}
      <div className="card">
        <AdminList
          columns={['Subject']}
          data={subjects.map((s) => [s.subject])}
          loading={loading}
        />
      </div>
    </div>
  );
};