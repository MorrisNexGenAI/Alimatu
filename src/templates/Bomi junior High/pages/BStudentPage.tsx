import React from 'react';
import { useStudent } from '../../../hooks/useStudent';
import { useLevels } from '../../../hooks/useLevels';
import Select from '../../../components/common/Select';
import StudentForm from '../../../components/students/StudentForm';
import StudentList from '../../../components/students/StudentList';
import BomiTheme from '../bomi';
import '../styles/b_students.css';
import { Student } from '../../../types';

const BStudentPage: React.FC = () => {
  const { levels, loading: levelsLoading, error: levelsError } = useLevels();
  const {
    students,
    academicYears,
    selectedLevelId,
    selectedAcademicYearId,
    loading: studentsLoading,
    handleLevelChange,
    handleAcademicYearChange,
  } = useStudent();

  console.log('Students in BStudentPage:', JSON.stringify(students, null, 2));
  console.log('Levels in BStudentPage:', JSON.stringify(levels, null, 2));
  console.log('Academic Years in BStudentPage:', JSON.stringify(academicYears, null, 2));
  console.log('Level Options in BStudentPage:', JSON.stringify(
    levels.map((level) => ({ value: level.id.toString(), label: level.name })),
    null,
    2
  ));

  const levelOptions = [
    { value: '', label: 'Select Level' },
    ...levels.map((level) => ({
      value: level.id.toString(),
      label: level.name,
    })),
  ];

  const academicYearOptions = [
    { value: '', label: 'Select Academic Year' },
    ...academicYears.map((year) => ({
      value: year.id.toString(),
      label: year.name,
    })),
  ];

  function handleStudentAdded(student: Student): void {
    console.log('Student added:', JSON.stringify(student, null, 2));
    // TODO: Implement refresh logic (e.g., re-fetch students)
  }

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
            disabled={levelsLoading || studentsLoading}
            error={levelsError ?? undefined}
          />
          <Select
            label="Academic Year"
            value={selectedAcademicYearId?.toString() || ''}
            onChange={handleAcademicYearChange}
            options={academicYearOptions}
            disabled={studentsLoading}
            error={academicYears.length === 0 && !studentsLoading ? 'No academic years available' : undefined}
          />
        </div>

        {levelsLoading && <p className="b-student-message">Loading levels...</p>}
        {levelsError && <p className="b-student-message error">{levelsError}</p>}
        {!levels.length && !levelsLoading && !levelsError && (
          <p className="b-student-message">No levels available</p>
        )}
        {levels.length > 0 && !levelsLoading && levelOptions.length === 1 && (
          <p className="b-student-message error">Levels fetched but not rendering in dropdown. Check levelOptions.</p>
        )}

        {selectedLevelId && selectedAcademicYearId && (
          <>
            <StudentForm levelId={selectedLevelId} onStudentAdded={handleStudentAdded} />
            <StudentList students={students} />
          </>
        )}

        {studentsLoading && selectedLevelId && selectedAcademicYearId && (
          <p className="b-student-message">Loading students...</p>
        )}
        {!selectedLevelId && !levelsLoading && !levelsError && levels.length > 0 && (
          <p className="b-student-message">Please select a level</p>
        )}
        {selectedLevelId && !selectedAcademicYearId && !studentsLoading && (
          <p className="b-student-message">Please select an academic year</p>
        )}
      </div>
    </BomiTheme>
  );
};

export default BStudentPage;