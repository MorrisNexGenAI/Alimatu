import React from 'react';
import { useGradeEntry } from '../../../hooks/useGradeEntry';
import Select from '../../../components/common/Select';
import BomiTheme from '../bomi';
import '../styles/b_gradeentry.css';

const BGradeEntryPage: React.FC = () => {
  const {
    levels,
    academicYears,
    subjects,
    periods,
    students,
    selectedLevelId,
    selectedAcademicYearId,
    selectedSubjectId,
    selectedPeriodId,
    loading,
    grades,
    existingGrades,
    handleLevelChange,
    handleAcademicYearChange,
    handleSubjectChange,
    handlePeriodChange,
    handleGradeChange,
    handleCheckExistingGrades,
    handleSubmit,
  } = useGradeEntry();

  const levelOptions = [
    { value: '', label: 'Select a level' },
    ...(Array.isArray(levels) ? levels.map((level) => ({
      value: level.id.toString(),
      label: level.name,
    })) : []),
  ];

  const academicYearOptions = [
    { value: '', label: 'Select an academic year' },
    ...(Array.isArray(academicYears) ? academicYears.map((year) => ({
      value: year.id.toString(),
      label: year.name,
    })) : []),
  ];

  const subjectOptions = [
    { value: '', label: 'Select a subject' },
    ...(Array.isArray(subjects) ? subjects.map((subject) => ({
      value: subject.id.toString(),
      label: subject.subject,
    })) : []),
  ];

  return (
    <BomiTheme>
      <div className="b-gradeentry-page p-4">
        <h1 className="b-gradeentry-heading">Grade Entry</h1>

        <div className="grid gap-4 sm:grid-cols-2 mb-4">
          <Select
            label="Select Level"
            value={selectedLevelId?.toString() || ''}
            onChange={handleLevelChange}
            options={levelOptions}
            disabled={loading}
          />
          <Select
            label="Select Academic Year"
            value={selectedAcademicYearId?.toString() || ''}
            onChange={handleAcademicYearChange}
            options={academicYearOptions}
            disabled={loading}
          />
        </div>

        {selectedLevelId && selectedAcademicYearId && (
          <div className="b-select-group">
            <Select
              label="Select Student"
              value={''}
              disabled={true}
              options={[{ value: '', label: 'All Students' }]}
            />
            <Select
              label="Select Subject"
              value={selectedSubjectId?.toString() || ''}
              onChange={handleSubjectChange}
              options={subjectOptions}
              disabled={loading}
            />
            <Select
              label="Select Period"
              value={selectedPeriodId?.toString() || ''}
              onChange={handlePeriodChange}
              options={[
                { value: '', label: 'Select a period' },
                ...(Array.isArray(periods) ? periods.map((period) => ({
                  value: period.id.toString(),
                  label: period.period,
                })) : []),
              ]}
              disabled={loading}
            />
            <button
              className="b-check-button p-2 bg-blue-500 text-white rounded"
              onClick={handleCheckExistingGrades}
              disabled={loading || !selectedLevelId || !selectedAcademicYearId || !selectedSubjectId || !selectedPeriodId}
            >
              Check Existing Grade
            </button>
          </div>
        )}

        {selectedLevelId && selectedAcademicYearId && (
          students.length > 0 ? (
            <div className="b-gradeentry-table-container">
              <table className="w-full border-collapse mt-4">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Student Name</th>
                    <th className="border p-2">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border">
                      <td className="border p-2">
                        <span
                          className="b-student-name cursor-pointer text-blue-600 hover:underline"
                        >
                          {`${student.firstName} ${student.lastName}`}
                        </span>
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          value={
                            grades[student.id] !== undefined && grades[student.id] !== null
                              ? grades[student.id]!
                              : ''
                          }
                          onChange={(e) => handleGradeChange(student.id, e.target.value)}
                          className="b-grade-input w-full p-1 border rounded"
                          min="0"
                          max="100"
                          disabled={loading || !selectedSubjectId || !selectedPeriodId}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="b-button-group mt-4">
                <button
                  className="b-submit-button p-2 bg-blue-500 text-white rounded"
                  onClick={handleSubmit}
                  disabled={loading || !selectedSubjectId || !selectedPeriodId}
                >
                  Submit Grade
                </button>
              </div>
            </div>
          ) : (
            <p className="b-gradeentry-message mt-4">
              {loading ? 'Loading students...' : 'No students available for this level and academic year.'}
            </p>
          )
        )}
      </div>
    </BomiTheme>
  );
};

export default BGradeEntryPage;