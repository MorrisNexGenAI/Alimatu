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
    selectedLevelId,
    loading: studentsLoading,
    handleLevelChange,
  } = useStudent();

  const levelOptions = [
    { value: '', label: 'Select Level' },
    ...levels.map((level) => ({
      value: level.id.toString(),
      label: level.name,
    })),
  ];

  function handleStudentAdded(student: Student): void {
    throw new Error('Function not implemented.');
  }

  return (
    <BomiTheme>
      <div className="b-student-page p-4">
        <h2 className="b-student-heading">Add Students</h2>

        <Select
          label="Level"
          value={selectedLevelId?.toString() || ''}
          onChange={handleLevelChange}
          options={levelOptions}
          disabled={levelsLoading || studentsLoading}
          onError={levelsError}
        />

        {levelsLoading && <p className="b-student-message">Loading levels...</p>}
        {levelsError && <p className="b-student-message error">{levelsError}</p>}
        {!levels.length && !levelsLoading && !levelsError && (
          <p className="b-student-message">No levels available</p>
        )}

        {selectedLevelId && (
          <>
            <StudentForm levelId={selectedLevelId} onStudentAdded={handleStudentAdded} />
            <StudentList students={students} />
          </>
        )}

        {studentsLoading && selectedLevelId && <p className="b-student-message">Loading students...</p>}
        {!selectedLevelId && !levelsLoading && !levelsError && levels.length > 0 && (
          <p className="b-student-message">Please select a level</p>
        )}
      </div>
    </BomiTheme>
  );
};

export default BStudentPage;