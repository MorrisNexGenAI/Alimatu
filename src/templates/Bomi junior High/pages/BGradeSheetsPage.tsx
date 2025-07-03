import React from 'react';
import { useGradeSheets } from '../../../hooks/useGradeSheets';
import Select from '../../../components/common/Select';
import GradeSheetTable from '../../../components/grade_sheets/GradeSheetTable';
import Modal from '../../../components/common/Modal';
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
    pdfUrls,
    pdfLoading,
    modal,
    handleLevelChange,
    handleAcademicYearChange,
    openModal,
    closeModal,
    handleConfirmModal,
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
      <div className="b-gradesheet-page p-4 max-w-7xl mx-auto">
        <h2 className="b-gradesheet-title text-2xl font-bold mb-4">Grade Sheet Overview</h2>

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

        <div className="mb-4">
          <button
            className={`bg-blue-500 text-white p-2 rounded text-sm ${loading || !selectedLevelId || !selectedAcademicYearId || pdfLoading?.[`level_${selectedLevelId}`] ? 'opacity-50' : ''}`}
            onClick={() => openModal(null, 'print_level')}
            disabled={loading || !selectedLevelId || !selectedAcademicYearId || pdfLoading?.[`level_${selectedLevelId}`]}
          >
            {pdfLoading?.[`level_${selectedLevelId}`] ? 'Generating...' : 'Generate PDF for Level'}
          </button>
          {pdfUrls[`level_${selectedLevelId}`] && (
            <a
              href={pdfUrls[`level_${selectedLevelId}`]}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 text-blue-500 underline text-sm"
            >
              View Level PDF
            </a>
          )}
        </div>

        {selectedLevelId && selectedAcademicYearId && !loading && (
          <div>
            {gradeSheets.length > 0 ? (
              <div>
                {gradeSheets.map((sheet) => (
                  <div key={sheet.student_id} className="mb-6">
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
                      openModal={openModal}
                      pdfUrls={pdfUrls}
                      pdfLoading={pdfLoading}
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

        {modal.show && (
          <Modal onClose={closeModal}>
            <div className="p-4 max-h-[80vh] overflow-y-auto">
              <h2 className="text-lg font-medium mb-4">
                Confirm {modal.action === 'print' ? 'Student Periodic PDF' : 'Level Periodic PDF'} Generation
              </h2>
              <p className="mb-4">
                Are you sure you want to generate the{' '}
                {modal.action === 'print' ? 'student' : 'level'} periodic report card?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-300 text-black p-2 rounded text-sm"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white p-2 rounded text-sm"
                  onClick={handleConfirmModal}
                >
                  Confirm
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </BomiTheme>
  );
};

export default BGradeSheetsPage;