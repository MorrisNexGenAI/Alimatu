import React from 'react';
import { useStudent } from '../../../hooks/useStudent';
import Select from '../../../components/common/Select';
import StudentForm from '../../../components/students/StudentForm';
import StudentList from '../../../components/students/StudentList';
import BomiTheme from '../bomi';
import '../styles/b_students.css';
import type { Student } from '../../../types';

const BStudentPage: React.FC = () => {
  const {
    students,
    levels,
    academicYears,
    selectedLevelId,
    selectedAcademicYearId,
    loading,
    handleLevelChange,
    handleAcademicYearChange,
    addStudentAndEnroll,
  } = useStudent();

  console.log('Students in BStudentPage:', JSON.stringify(students, null, 2));
  console.log('Levels in BStudentPage:', JSON.stringify(levels, null, 2));
  console.log('Academic Years in BStudentPage:', JSON.stringify(academicYears, null, 2));

  const levelOptions = [
    { value: '', label: 'Select Level' },
    ...(Array.isArray(levels) ? levels.map((level) => ({
      value: level.id.toString(),
      label: level.name,
    })) : []),
  ];

  const academicYearOptions = [
    { value: '', label: 'Select Academic Year' },
    ...(Array.isArray(academicYears) ? academicYears.map((year) => ({
      value: year.id.toString(),
      label: year.name,
    })) : []),
  ];

  return (
    <BomiTheme>
      <div className="b-student-page p-4">
        <h2 className="b-student-heading">Add Students</h2>

        <div className="flex space-x-4 mb-4">
          <Select
            label="Level"
            value={selectedLevelId?.toString() || ''}
            onChange={handleLevelChange}
            options={levelOptions}
            disabled={loading}
          />
          <Select
            label="Academic Year"
            value={selectedAcademicYearId?.toString() || ''}
            onChange={handleAcademicYearChange}
            options={academicYearOptions}
            disabled={loading}
            error={academicYears.length === 0 && !loading ? 'No academic years available' : undefined}
          />
        </div>

        {loading && <p className="b-student-message">Loading...</p>}
        {!levels.length && !loading && (
          <p className="b-student-message">No levels available</p>
        )}
        {levels.length > 0 && !loading && levelOptions.length === 1 && (
          <p className="b-student-message error">Levels fetched but not rendering in dropdown. Check levelOptions.</p>
        )}

        {selectedLevelId && selectedAcademicYearId && (
          <>
            <StudentForm
              levelId={selectedLevelId}
              academicYearId={selectedAcademicYearId}
              onStudentAdded={addStudentAndEnroll}
            />
            <StudentList students={students} />
          </>
        )}

        {loading && selectedLevelId && selectedAcademicYearId && (
          <p className="b-student-message">Loading students...</p>
        )}
        {selectedLevelId && !selectedAcademicYearId && !loading && (
          <p className="b-student-message">Please select an academic year</p>
        )}
        {!selectedLevelId && !loading && levels.length > 0 && (
          <p className="b-student-message">Please select a level</p>
        )}
      </div>
    </BomiTheme>
  );
};

export default BStudentPage;