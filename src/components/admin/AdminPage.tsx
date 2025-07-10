import React, { useState } from 'react';
import { SubjectPage } from './forms/SubjectPage';
import { LevelPage } from './forms/LevelPage';
import { AcademicYearsForm } from './forms/AcademicYear';
import { PeriodsForm } from './forms/Periods';
import { AcademicYearsList } from './lists/AcademicYearList';
import { PeriodsList } from './lists/PeriodList';
import { useAuth } from '../../context/AuthProvider';
import { useAcademicYears } from '../../hooks/useAcademicYears';
import { usePeriods } from '../../hooks/usePeriods';
import BomiTheme from '../../templates/Bomi junior High/bomi';

const sections = [
  {
    name: 'Academic Years',
    FormComponent: AcademicYearsForm,
    ListComponent: AcademicYearsList,
  },
  {
    name: 'Levels',
    component: <LevelPage />,
  },
  {
    name: 'Subjects',
    component: <SubjectPage />,
  },
  {
    name: 'Periods',
    FormComponent: PeriodsForm,
    ListComponent: PeriodsList,
  },
];

export const AdminPage: React.FC = () => {
  const { token } = useAuth();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const { academicYears, addAcademicYear, editAcademicYear, removeAcademicYear, loading: ayLoading, error: ayError } = useAcademicYears(token || '');
  const { periods, addPeriod, editPeriod, removePeriod, loading: pLoading, error: pError } = usePeriods(token || '');

  const toggleSection = (sectionName: string) => {
    setOpenSection(openSection === sectionName ? null : sectionName);
    setEditingItem(null);
  };

  const handleEdit = (sectionName: string, item: any) => {
    setEditingItem(item);
    setOpenSection(sectionName);
  };

  const handleAdd = (sectionName: string) => {
    setEditingItem(null);
    setOpenSection(sectionName);
  };

  return (
    <BomiTheme>
      <div className="container">
        <div className="bomi-header">
          <div className="bomi-logo">
            <img src="/logo.png" alt="Bomi Junior High Logo" />
          </div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.name} className="card">
              <div
                className="flex justify-between items-center p-4 cursor-pointer"
                onClick={() => toggleSection(section.name)}
              >
                <h2 className="text-xl font-semibold">{section.name}</h2>
                <span>{openSection === section.name ? '−' : '+'}</span>
              </div>
              {openSection === section.name && (
                <div className="p-4">
                  {section.component || (
                    <>
                      <button
                        onClick={() => handleAdd(section.name)}
                        className="bg-green-500 text-white p-2 rounded mb-4"
                      >
                        [+ Add {section.name}]
                      </button>
                      {(ayError || pError) && (
                        <p className="text-red-500">{ayError || pError}</p>
                      )}
                      {(ayLoading || pLoading) && <p>Loading...</p>}
                      {section.name === 'Academic Years' && (
                        <>
                          {editingItem || !editingItem ? (
                            <section.FormComponent
                              initialData={editingItem}
                              onSubmit={(data: any) =>
                                editingItem
                                  ? editAcademicYear(editingItem.id, data)
                                  : addAcademicYear(data)
                              }
                              onCancel={() => setEditingItem(null)}
                            />
                          ) : null}
                          <section.ListComponent
                            academicYears={academicYears}
                            onEdit={(item: any) => handleEdit(section.name, item)}
                            onDelete={removeAcademicYear}
                            loading={ayLoading}
                          />
                        </>
                      )}
                      {section.name === 'Periods' && (
                        <>
                          {editingItem || !editingItem ? (
                            <section.FormComponent
                              initialData={editingItem}
                              onSubmit={(data: any) =>
                                editingItem
                                  ? editPeriod(editingItem.id, data)
                                  : addPeriod(data)
                              }
                              onCancel={() => setEditingItem(null)}
                            />
                          ) : null}
                          <section.ListComponent
                            periods={periods}
                            onEdit={(item: any) => handleEdit(section.name, item)}
                            onDelete={removePeriod}
                            loading={pLoading}
                          />
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="bomi-footer">
          <p>© 2025 Bomi Junior High. All rights reserved.</p>
        </div>
      </div>
    </BomiTheme>
  );
};