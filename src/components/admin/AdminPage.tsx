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
import type { Level, Subject, AcademicYear, Period } from '../../types/index';
import toast from 'react-hot-toast';

export const AdminPage: React.FC = () => {
  // Why: Include academicYears and periods in tabs
  const [activeTab, setActiveTab] = useState<'levels' | 'subjects' | 'academicYears' | 'periods'>('levels');
  const [editingLevel, setEditingLevel] = useState<Level | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingAcademicYear, setEditingAcademicYear] = useState<AcademicYear | null>(null);
  const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);

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

  // Why: Log activeTab to debug tab switching
  console.log('Active Tab:', activeTab);

  // Level form submission
  const handleLevelSubmit = (values: { name: string }) => {
    if (!values.name) {
      toast.error('Level name is required');
      return;
    }
    if (editingLevel) {
      editLevel(editingLevel.id, values);
      setEditingLevel(null);
    } else {
      addLevel(values);
    }
  };

  // Subject form submission
  const handleSubjectSubmit = (values: { subject: string; level_id: string }) => {
    // Why: Strengthen validation to prevent null level_id
    if (!selectedLevelId || !values.level_id || isNaN(parseInt(values.level_id))) {
      toast.error('Please select a valid level');
      return;
    }
    const data = {
      subject: values.subject,
      level_id: parseInt(values.level_id),
    };
    console.log('Subject Submit Payload:', data); // Why: Debug payload
    if (editingSubject) {
      updateSubject(editingSubject.id, data);
      setEditingSubject(null);
    } else {
      createSubject(data);
    }
  };

  // Academic Year form submission
  const handleAcademicYearSubmit = (values: Record<string, string>) => {
    // Why: Validate name format (YYYY/YYYY) to match Django model
    const nameRegex = /^\d{4}\/\d{4}$/;
    if (!values.name || !nameRegex.test(values.name)) {
      toast.error('Academic year name must be in YYYY/YYYY format (e.g., 2024/2025)');
      return;
    }
    // Why: Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!values.start_date || !dateRegex.test(values.start_date)) {
      toast.error('Start date must be in YYYY-MM-DD format');
      return;
    }
    if (!values.end_date || !dateRegex.test(values.end_date)) {
      toast.error('End date must be in YYYY-MM-DD format');
      return;
    }
    // Why: Validate name years match date years and end year is start year + 1
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
    // Why: Validate end_date > start_date
    if (new Date(values.end_date) <= new Date(values.start_date)) {
      toast.error('End date must be after start date');
      return;
    }
    const data = {
      name: values.name,
      start_date: values.start_date,
      end_date: values.end_date,
    };
    console.log('Academic Year Submit Payload:', data); // Why: Debug payload
    if (editingAcademicYear) {
      editAcademicYear(editingAcademicYear.id, data);
      setEditingAcademicYear(null);
    } else {
      addAcademicYear(data);
    }
  };

  // Period form submission
  const handlePeriodSubmit = (values: Record<string, string>) => {
    if (!values.period) {
      toast.error('Period name is required');
      return;
    }
    const data = { period: values.period };
    console.log('Period Submit Payload:', data); // Why: Debug payload
    if (editingPeriod) {
      editPeriod(editingPeriod.id, data);
      setEditingPeriod(null);
    } else {
      addPeriod(data);
    }
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
              activeTab === 'subjects' ? 'bg-blue-500 text-white' : 'bg-gray-200'
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
              initialValues={editingLevel ? { name: editingLevel.name } : undefined}
            />
            <LevelList
              levels={levels}
              loading={levelsLoading}
              onEdit={setEditingLevel}
              onDelete={removeLevel}
            />
          </div>
        )}

        {/* Subjects Section */}
        {activeTab === 'subjects' && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Subjects</h2>
            {/* Why: Log props to debug SubjectForm rendering */}
            {console.log('SubjectForm props:', {
              levels: subjectLevels,
              onSubmit: handleSubjectSubmit,
              disabled: subjectsLoading || !selectedLevelId,
              loading: subjectsLoading,
              initialValues: editingSubject
                ? { subject: editingSubject.subject, level_id: editingSubject.level_id.toString() }
                : undefined,
            })}
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
              initialValues={
                editingSubject
                  ? { subject: editingSubject.subject, level_id: editingSubject.level_id.toString() }
                  : undefined
              }
            />
            <SubjectList
              subjects={subjects}
              levels={subjectLevels}
              loading={subjectsLoading}
              onEdit={setEditingSubject}
              onDelete={deleteSubject}
            />
          </div>
        )}

        {/* Academic Years Section */}
        {activeTab === 'academicYears' && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Academic Years</h2>
            {/* Why: Add border to debug if form is rendered but hidden */}
            <div className="border border-red-500 p-4">
              <AcademicYearForm
                onSubmit={handleAcademicYearSubmit}
                disabled={academicYearsLoading}
                loading={academicYearsLoading}
                initialValues={
                  editingAcademicYear
                    ? { name: editingAcademicYear.name, start_date: editingAcademicYear.start_date, end_date: editingAcademicYear.end_date }
                    : undefined
                }
              />
            </div>
            <AcademicYearList
              academicYears={academicYears}
              loading={academicYearsLoading}
              onEdit={setEditingAcademicYear}
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
              initialValues={editingPeriod ? { period: editingPeriod.period } : undefined}
            />
            <PeriodList
              periods={periods}
              loading={periodsLoading}
              onEdit={setEditingPeriod}
              onDelete={deletePeriod}
            />
          </div>
        )}
      </div>
    </BomiTheme>
  );
};