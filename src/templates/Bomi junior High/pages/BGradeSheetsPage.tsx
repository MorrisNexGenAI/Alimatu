
import React from 'react';
import { useGradeSheets } from '../../../hooks/useGradeSheets';
import Select from '../../../components/common/Select';
import GradeSheetTable from '../../../components/grade_sheets/GradeSheetTable';
import BomiTheme from '../bomi';
import '../styles/b_gradesheets.css';

const BGradeSheetsPage: React.FC = () => {
  const {
    levels,
    academicYears,
    subjects,
    periods,
    selectedLevelId,
    selectedAcademicYearId,
    gradeSheets,
    loading,
    errors,
    handleLevelChange,
    handleAcademicYearChange,
  } = useGradeSheets();

  if (loading && !selectedLevelId && !selectedAcademicYearId) {
    return <p className="b-gradesheet-message">Loading data...</p>;
  }

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
      <div className="b-gradesheet-page p-4">
        <h2 className="b-gradesheet-title">Grade Sheet Overview</h2>

        <div className="grid gap-4 sm:grid-cols-2 mb-4">
          <Select
            label="Level"
            value={selectedLevelId?.toString() || ''}
            onChange={handleLevelChange}
            options={levelOptions}
            disabled={loading}
            error={errors.levels}
          />
          <Select
            label="Academic Year"
            value={selectedAcademicYearId?.toString() || ''}
            onChange={handleAcademicYearChange}
            options={academicYearOptions}
            disabled={loading}
            error={errors.academicYears}
          />
        </div>

        {selectedLevelId && selectedAcademicYearId && !loading && (
          <div>
            {gradeSheets.length > 0 ? (
              <div>
                {gradeSheets.map((sheet) => (
                  <div key={sheet.student_id} className="mb-6">
                    <h3 className="b-gradesheet-title">{sheet.student_name}'s Gradesheet</h3>
                    <GradeSheetTable
                      gradesheets={[{
                        ...sheet,
                        subjects: sheet.subjects.map(subj => ({
                          subject_id: subj.subject_id,
                          subject_name: subj.subject_name,
                          first_period: subj['1st']?.toString() ?? '',
                          second_period: subj['2nd']?.toString() ?? '',
                          third_period: subj['3rd']?.toString() ?? '',
                          first_exam: subj['1exam']?.toString() ?? '',
                          fourth_period: subj['4th']?.toString() ?? '',
                          fifth_period: subj['5th']?.toString() ?? '',
                          sixth_period: subj['6th']?.toString() ?? '',
                          second_exam: subj['2exam']?.toString() ?? '',
                          sem1_avg: subj['1a']?.toString() ?? '',
                          sem2_avg: subj['2a']?.toString() ?? '',
                          final_avg: subj['f']?.toString() ?? '',
                        }))
                      }]}
                      subjects={subjects}
                      periods={periods}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="b-gradesheet-message">
                {errors.grades || errors.students || 'No gradesheets found for this level and academic year'}
              </p>
            )}
          </div>
        )}

        {loading && selectedLevelId && selectedAcademicYearId && (
          <p className="b-gradesheet-message">Loading gradesheets...</p>
        )}
        {(!selectedLevelId || !selectedAcademicYearId) && (
          <p className="b-gradesheet-message">Please select a level and academic year</p>
        )}
      </div>
    </BomiTheme>
  );
};

export default BGradeSheetsPage;
