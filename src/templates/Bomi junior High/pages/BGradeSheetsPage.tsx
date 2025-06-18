import React from 'react';
import { useGradeSheets } from '../../../hooks/useGradeSheets';
import Select from '../../../components/common/Select';
import BomiTheme from '../bomi';
import '../styles/b_gradesheets.css';

const BGradeSheetsPage: React.FC = () => {
  const {
    levels,
    academicYears,
    selectedLevelId,
    selectedAcademicYearId,
    students,
    gradeSheets,
    loading,
    pdfLoading,
    errors,
    pdfUrls,
    handleLevelChange,
    handleAcademicYearChange,
    handleGeneratePDF,
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

        {selectedLevelId && selectedAcademicYearId && (
          <div className="mt-4">
            <button
              className="b-generate-btn p-2 bg-blue-500 text-white rounded flex items-center"
              onClick={() => handleGeneratePDF(selectedLevelId)}
              disabled={loading || pdfLoading[`level_${selectedLevelId}`]}
            >
              {pdfLoading[`level_${selectedLevelId}`] ? (
                <>
                  <span className="animate-spin mr-2">⌀</span>
                  Generating...
                </>
              ) : (
                'Generate PDF for Level'
              )}
            </button>
            {pdfUrls[`level_${selectedLevelId}`] && (
              <p className="mt-2">
                <a
                  href={pdfUrls[`level_${selectedLevelId}`]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Level PDF
                </a>
              </p>
            )}
          </div>
        )}

        {selectedLevelId && selectedAcademicYearId && !loading && (
          <div>
            {students.length > 0 ? (
              students.map((student) => {
                const gradeSheet = gradeSheets.find((sheet) => sheet.student_id === student.id) || {
                  student_id: student.id,
                  student_name: `${student.firstName} ${student.lastName}`,
                  subjects: [],
                };
                return (
                  <div key={student.id} className="mb-6">
                    <h3 className="b-student-title">{gradeSheet.student_name}'s Grade Sheet</h3>
                    <button
                      className="b-generate-btn p-2 bg-gray-500 text-white rounded flex items-center"
                      onClick={() => handleGeneratePDF(selectedLevelId, student.id)}
                      disabled={loading || pdfLoading[`student_${student.id}`]}
                    >
                      {pdfLoading[`student_${student.id}`] ? (
                        <>
                          <span className="animate-spin mr-2">⌀</span>
                          Generating...
                        </>
                      ) : (
                        `Generate PDF for ${student.firstName} ${student.lastName}`
                      )}
                    </button>
                    {pdfUrls[`student_${student.id}`] && (
                      <p className="mt-2">
                        <a
                          href={pdfUrls[`student_${student.id}`]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          View Student PDF
                        </a>
                      </p>
                    )}
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border p-2">Subjects</th>
                          <th className="border p-2">1st Period</th>
                          <th className="border p-2">2nd Period</th>
                          <th className="border p-2">3rd Period</th>
                          <th className="border p-2">1st Exam</th>
                          <th className="border p-2">1st Semester Avg</th>
                          <th className="border p-2">4th Period</th>
                          <th className="border p-2">5th Period</th>
                          <th className="border p-2">6th Period</th>
                          <th className="border p-2">2nd Exam</th>
                          <th className="border p-2">2nd Semester Avg</th>
                          <th className="border p-2">Final Avg</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gradeSheet.subjects.map((subjectData) => (
                          <tr key={subjectData.subject_id} className="border">
                            <td className="p-2">{subjectData.subject_name}</td>
                            <td className="p-2 text-center">{subjectData['1st'] || '-'}</td>
                            <td className="p-2 text-center">{subjectData['2nd'] || '-'}</td>
                            <td className="p-2 text-center">{subjectData['3rd'] || '-'}</td>
                            <td className="p-2 text-center">{subjectData['1exam'] || '-'}</td>
                            <td className="p-2 text-center">{subjectData.sem1_avg || '-'}</td>
                            <td className="p-2 text-center">{subjectData['4th'] || '-'}</td>
                            <td className="p-2 text-center">{subjectData['5th'] || '-'}</td>
                            <td className="p-2 text-center">{subjectData['6th'] || '-'}</td>
                            <td className="p-2 text-center">{subjectData['2exam'] || '-'}</td>
                            <td className="p-2 text-center">{subjectData.sem2_avg || '-'}</td>
                            <td className="p-2 text-center">{subjectData.final_avg || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })
            ) : (
              <p className="b-gradesheet-message">
                {errors.students || errors.grades || 'No students found for this level and academic year'}
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