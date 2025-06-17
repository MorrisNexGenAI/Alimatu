import React from 'react';
import { useStudent } from '../../../hooks/useStudent';
import Select from '../../../components/common/Select';
import StudentForm from '../../../components/students/StudentForm';
import StudentList from '../../../components/students/StudentList';
import BomiTheme from '../bomi';
import '../styles/b_students.css';

const BStudentPage: React.FC = () => {
  const {
    levels,
    students,
    selectedLevelId,
    loading,
    errors,
    handleLevelChange,
    handleStudentAdded,
  } = useStudent();

  return (
    <BomiTheme>
      <div className="b-student-page p-4">
        <h2 className="b-student-heading">Add Students</h2>

        <Select
          label="Level"
          value={selectedLevelId?.toString() || ''}
          onChange={handleLevelChange}
          options={[
            { value: '', label: 'Select Level' },
            ...levels.map((level) => ({
              value: level.id.toString(),
              label: level.name,
            })),
          ]}
          disabled={loading}
          error={errors.levels}
        />

        {selectedLevelId && (
          <>
            <StudentForm levelId={selectedLevelId} onStudentAdded={handleStudentAdded} />
            <StudentList students={students} error={errors.students} />
          </>
        )}

        {loading && selectedLevelId && <p className="b-student-message">Loading students...</p>}
        {!selectedLevelId && <p className="b-student-message">Please select a level</p>}
      </div>
    </BomiTheme>
  );
};

export default BStudentPage;