import React, { useState } from 'react';
import { SubjectList } from './lists/SubjectList';
import { LevelList } from './lists/LevelList';
import { AcademicYearList } from './lists/AcademicYearList';
import { PeriodList } from './lists/PeriodList';
import { SubjectForm } from './forms/Subject';
import { LevelForm } from './forms/Level';
import { AcademicYearForm } from './forms/AcademicYear';
import { PeriodForm } from './forms/Periods';
import { useLevels } from '../../hooks/useLevels';
import { useSubjects } from '../../hooks/useSubjects';
import { useAcademicYears } from '../../hooks/useAcademicYears';
import { usePeriods } from '../../hooks/usePeriods';
import BomiTheme from '../../templates/Bomi junior High/bomi';
import type { Level, Subject, AcademicYear, Period } from '../../types';
import toast from 'react-hot-toast';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'levels' | 'subjects' | 'academicYears' | 'periods'>('levels');

  const { levels, loading: levelsLoading, addLevel, editLevel, removeLevel } = useLevels();
  const {
    subjects,
    levels: subjectLevels,
    selectedLevelId,
    handleLevelChange,
    createSubject,
    updateSubject,
    deleteSubject,
    loading: subjectsLoading,
  } = useSubjects();
  const { academicYears, loading: academicYearsLoading, addAcademicYear, editAcademicYear, deleteAcademicYear } = useAcademicYears();
  const { periods, loading: periodsLoading, addPeriod, editPeriod, deletePeriod } = usePeriods();

  console.log('Active Tab:', activeTab); // Debug: Log active tab

  // Level form submission (for adding new levels)
  const handleLevelSubmit = (values: { name: string }) => {
    if (!values.name) {
      toast.error('Level name is required');
      return;
    }
    addLevel(values);
  };

  // Subject form submission (for adding new subjects)
  const handleSubjectSubmit = (values: { subject: string; level_id: string }) => {
    if (!selectedLevelId || !values.level_id || isNaN(parseInt(values.level_id))) {
      toast.error('Please select a valid level');
      return;
    }
    const data = {
      subject: values.subject,
      level_id: parseInt(values.level_id),
    };
    console.log('Subject Submit Payload:', data);
    createSubject(data);
  };

  // Academic Year form submission (for adding new academic years)
  const handleAcademicYearSubmit = (values: Record<string, string>) => {
    const nameRegex = /^\d{4}\/\d{4}$/;
    if (!values.name || !nameRegex.test(values.name)) {
      toast.error('Academic year name must be in YYYY/YYYY format (e.g., 2024/2025)');
      return;
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!values.start_date || !dateRegex.test(values.start_date)) {
      toast.error('Start date must be in YYYY-MM-DD format');
      return;
    }
    if (!values.end_date || !dateRegex.test(values.end_date)) {
      toast.error('End date must be in YYYY-MM-DD format');
      return;
    }
    const [startYear, endYear] = values.name.split('/').map(Number);
    const startDateYear = new Date(values.start_date).getFullYear();
    const endDateYear = new Date(values.end_date).getFullYear();
    if (startDateYear !== startYear || endDateYear !== endYear) {
      toast.error('Start and end dates must match the years in the name');
      return;
    }
    if (endYear !== startYear + 1) {
      toast.error('End year must be one year after start year');
      return;
    }
    if (new Date(values.end_date) <= new Date(values.start_date)) {
      toast.error('End date must be after start date');
      return;
    }
    const data = {
      name: values.name,
      start_date: values.start_date,
      end_date: values.end_date,
    };
    console.log('Academic Year Submit Payload:', data);
    addAcademicYear(data);
  };

  // Period form submission (for adding new periods)
  const handlePeriodSubmit = (values: Record<string, string>) => {
    if (!values.period) {
      toast.error('Period name is required');
      return;
    }
    const data = { period: values.period };
    console.log('Period Submit Payload:', data);
    addPeriod(data);
  };

  return (
    <BomiTheme>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="mb-4 flex space-x-2">
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === 'levels' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setActiveTab('levels')}
          >
            Manage Levels
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === 'subjects' ? 'bg-white-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setActiveTab('subjects')}
          >
            Manage Subjects
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === 'academicYears' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setActiveTab('academicYears')}
          >
            Manage Academic Years
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === 'periods' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setActiveTab('periods')}
          >
            Manage Periods
          </button>
        </div>

        {/* Levels Section */}
        {activeTab === 'levels' && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Levels</h2>
            <LevelForm
              onSubmit={handleLevelSubmit}
              disabled={levelsLoading}
              loading={levelsLoading}
            />
            <LevelList
              levels={levels}
              loading={levelsLoading}
              editLevel={editLevel}
              onDelete={removeLevel}
            />
          </div>
        )}

        {/* Subjects Section */}
        {activeTab === 'subjects' && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Subjects</h2>
            <select
              value={selectedLevelId || ''}
              onChange={handleLevelChange}
              className="border p-2 rounded-md mb-4 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a Level</option>
              {subjectLevels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
            <SubjectForm
              levels={subjectLevels}
              onSubmit={handleSubjectSubmit}
              disabled={subjectsLoading || !selectedLevelId}
              loading={subjectsLoading}
            />
            <SubjectList
              subjects={subjects}
              levels={subjectLevels}
              loading={subjectsLoading}
              updateSubject={updateSubject}
              onDelete={deleteSubject}
            />
          </div>
        )}

        {/* Academic Years Section */}
        {activeTab === 'academicYears' && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Academic Years</h2>
            <AcademicYearForm
              onSubmit={handleAcademicYearSubmit}
              disabled={academicYearsLoading}
              loading={academicYearsLoading}
            />
            <AcademicYearList
              academicYears={academicYears}
              loading={academicYearsLoading}
              editAcademicYear={editAcademicYear}
              onDelete={deleteAcademicYear}
            />
          </div>
        )}

        {/* Periods Section */}
        {activeTab === 'periods' && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Periods</h2>
            <PeriodForm
              onSubmit={handlePeriodSubmit}
              disabled={periodsLoading}
              loading={periodsLoading}
            />
            <PeriodList
              periods={periods}
              loading={periodsLoading}
              editPeriod={editPeriod}
              onDelete={deletePeriod}
            />
          </div>
        )}
      </div>
    </BomiTheme>
  );
};