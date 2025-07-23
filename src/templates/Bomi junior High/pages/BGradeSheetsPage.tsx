import React, { useState } from 'react';
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

  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

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

  const handleStudentSelect = (studentId: number) => {
    setSelectedStudentId(studentId);
  };

  const selectedGradeSheet = gradeSheets.find(
    (sheet) => sheet.student_id === selectedStudentId
  );

  return (
    <BomiTheme>
      <div className="b-gradesheet-container">
        <div className="b-gradesheet-card">
          <h2 className="b-gradesheet-title">Explore Student Grades</h2>
          <p className="b-gradesheet-subtitle">Unlock academic insights with ease</p>

          <div className="b-student-list">
            <h3 className="b-student-list-title">Our Students</h3>
            {gradeSheets.length > 0 ? (
              <ul className="b-student-list-items">
                {gradeSheets.map((sheet) => (
                  <li
                    key={sheet.student_id}
                    className={`b-student-item ${
                      selectedStudentId === sheet.student_id ? 'b-student-item-selected' : ''
                    }`}
                    onClick={() => handleStudentSelect(sheet.student_id)}
                  >
                    <span className="b-student-dot"></span>
                    <span className="b-student-name">{sheet.student_name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="b-message b-message-error">
                {errors.grades || errors.students || 'No students found for this level and academic year'}
              </p>
            )}
          </div>

          <div className="b-gradesheet-selectors">
            <Select
              label="Level"
              value={selectedLevelId?.toString() || ''}
              onChange={handleLevelChange}
              options={levelOptions}
              disabled={loading}
              error={errors.levels}
              className="b-select"
            />
            <Select
              label="Academic Year"
              value={selectedAcademicYearId?.toString() || ''}
              onChange={handleAcademicYearChange}
              options={academicYearOptions}
              disabled={loading}
              error={errors.academicYears}
              className="b-select"
            />
          </div>

          {loading && !selectedLevelId && !selectedAcademicYearId && (
            <p className="b-message">Loading data...</p>
          )}

          {selectedLevelId && selectedAcademicYearId && !loading && (
            <div className="b-gradesheet-content">
              <div className="b-gradesheet-table">
                {selectedGradeSheet ? (
                  <GradeSheetTable
                    gradesheets={[selectedGradeSheet]}
                    subjects={subjects}
                    periods={periods}
                    openModal={openModal}
                    pdfUrls={pdfUrls}
                    pdfLoading={pdfLoading}
                  />
                ) : (
                  <p className="b-message">Select a student to view their academic journey</p>
                )}
              </div>

              <div className="b-gradesheet-actions">
                <button
                  className={`b-button b-button-primary ${
                    loading || !selectedLevelId || !selectedAcademicYearId || pdfLoading?.[`level_${selectedLevelId}`]
                      ? 'b-button-disabled'
                      : ''
                  }`}
                  onClick={() => openModal(null, 'print_level')}
                  disabled={loading || !selectedLevelId || !selectedAcademicYearId || pdfLoading?.[`level_${selectedLevelId}`]}
                >
                  {pdfLoading?.[`level_${selectedLevelId}`] ? (
                    <span className="b-button-loading">
                      <svg className="b-spinner" viewBox="0 0 24 24">
                        <circle className="b-spinner-path" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="b-spinner-path-fill" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    'Generate Level PDF'
                  )}
                </button>
                {pdfUrls[`level_${selectedLevelId}`] && (
                  <a
                    href={pdfUrls[`level_${selectedLevelId}`]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="b-link"
                  >
                    View Level PDF
                  </a>
                )}
              </div>
            </div>
          )}

          {loading && selectedLevelId && selectedAcademicYearId && (
            <p className="b-message">Loading gradesheets...</p>
          )}

          {modal.show && (
            <Modal onClose={closeModal}>
              <div className="b-modal-content">
                <h2 className="b-modal-title">
                  Confirm {modal.action === 'print' ? 'Student' : 'Level'} PDF Generation
                </h2>
                <p className="b-modal-text">
                  Ready to generate the {modal.action === 'print' ? 'student' : 'level'} periodic report card?
                </p>
                <div className="b-modal-actions">
                  <button
                    className="b-button b-button-secondary"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="b-button b-button-primary"
                    onClick={handleConfirmModal}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </Modal>
          )}
        </div>
      </div>
    </BomiTheme>
  );
};

export default BGradeSheetsPage;