import React from 'react';
import { useReportCard } from '../../../hooks/useReportCard';
import Select from '../../../components/common/Select';
import Modal from '../../../components/common/Modal';
import BomiTheme from '../bomi';
import '../styles/b_reportcard.css';

const BReportCardPage: React.FC = () => {
  const {
    levels,
    academicYears,
    selectedLevelId,
    selectedAcademicYearId,
    statuses,
    loading,
    errors,
    pdfUrls,
    pdfLoading,
    modal,
    allStatusesReady,
    handleLevelChange,
    handleAcademicYearChange,
    handleConfirmModal,
    openModal,
    closeModal,
  } = useReportCard();

  if (loading && !selectedLevelId && !selectedAcademicYearId) {
    return <p className="b-gradesheet-message">Loading data...</p>;
  }

  return (
    <BomiTheme>
      <div className="b-gradesheet-page p-4">
        <h2 className="b-gradesheet-title">Yearly Report Card Management</h2>

        <div className="grid gap-4 sm:grid-cols-2 mb-4">
          <Select
            label="Level"
            value={selectedLevelId?.toString() || ''}
            onChange={handleLevelChange}
            options={[
              { value: '', label: 'Select Level' },
              ...levels.map((level) => ({
                value: level.id.toString(),
                label: `Grade ${level.name}`,
              })),
            ]}
            disabled={loading}
            error={errors.initial}
          />
          <Select
            label="Academic Year"
            value={selectedAcademicYearId?.toString() || ''}
            onChange={handleAcademicYearChange}
            options={[
              { value: '', label: 'Select Academic Year' },
              ...academicYears.map((year) => ({
                value: year.id.toString(),
                label: year.name,
              })),
            ]}
            disabled={loading}
            error={errors.initial}
          />
        </div>

        {selectedLevelId && selectedAcademicYearId && (
          <div className="mt-4 flex space-x-4">
            <button
              className="p-2 bg-green-500 text-white rounded disabled:bg-gray-400"
              onClick={() => openModal(null, 'level_pass')}
              disabled={loading || !allStatusesReady || pdfLoading[`level_${selectedLevelId}_pass`]}
            >
              {pdfLoading[`level_${selectedLevelId}_pass`] ? 'Generating...' : 'Generate Level Pass PDF'}
            </button>
            <button
              className="p-2 bg-red-500 text-white rounded disabled:bg-gray-400"
              onClick={() => openModal(null, 'level_fail')}
              disabled={loading || !allStatusesReady || pdfLoading[`level_${selectedLevelId}_fail`]}
            >
              {pdfLoading[`level_${selectedLevelId}_fail`] ? 'Generating...' : 'Generate Level Fail PDF'}
            </button>
            <button
              className="p-2 bg-yellow-500 text-white rounded disabled:bg-gray-400"
              onClick={() => openModal(null, 'level_conditional')}
              disabled={loading || !allStatusesReady || pdfLoading[`level_${selectedLevelId}_conditional`]}
            >
              {pdfLoading[`level_${selectedLevelId}_conditional`] ? 'Generating...' : 'Generate Level Conditional PDF'}
            </button>
          </div>
        )}

        {selectedLevelId && selectedAcademicYearId && (
          <div className="mt-4">
            {pdfUrls[`level_${selectedLevelId}_pass`] && (
              <p className="mt-2">
                <a
                  href={pdfUrls[`level_${selectedLevelId}_pass`]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Level Pass PDF
                </a>
              </p>
            )}
            {pdfUrls[`level_${selectedLevelId}_fail`] && (
              <p className="mt-2">
                <a
                  href={pdfUrls[`level_${selectedLevelId}_fail`]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Level Fail PDF
                </a>
              </p>
            )}
            {pdfUrls[`level_${selectedLevelId}_conditional`] && (
              <p className="mt-2">
                <a
                  href={pdfUrls[`level_${selectedLevelId}_conditional`]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Level Conditional PDF
                </a>
              </p>
            )}
          </div>
        )}

        {selectedLevelId && selectedAcademicYearId && !loading && (
          <div className="mt-4">
            {statuses.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Student Name</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {statuses.map((status) => (
                    <tr key={status.id} className="border">
                      <td className="p-2">{`${status.student.firstName} ${status.student.lastName}`}</td>
                      <td className="p-2 text-center capitalize">{status.status.toLowerCase()}</td>
                      <td className="p-2 text-center space-x-2">
                        <button
                          className="p-1 bg-green-500 text-white rounded text-sm"
                          onClick={() => openModal(status.id, 'student_pass')}
                          disabled={loading || pdfLoading[`student_${status.student.id}_pass`]}
                        >
                          {pdfLoading[`student_${status.student.id}_pass`] ? 'Generating...' : 'Pass PDF'}
                        </button>
                        <button
                          className="p-1 bg-red-500 text-white rounded text-sm"
                          onClick={() => openModal(status.id, 'student_fail')}
                          disabled={loading || pdfLoading[`student_${status.student.id}_fail`]}
                        >
                          {pdfLoading[`student_${status.student.id}_fail`] ? 'Generating...' : 'Fail PDF'}
                        </button>
                        <button
                          className="p-1 bg-yellow-500 text-white rounded text-sm"
                          onClick={() => openModal(status.id, 'student_conditional')}
                          disabled={loading || pdfLoading[`student_${status.student.id}_conditional`]}
                        >
                          {pdfLoading[`student_${status.student.id}_conditional`] ? 'Generating...' : 'Conditional PDF'}
                        </button>
                        {pdfUrls[`student_${status.student.id}_pass`] && (
                          <a
                            href={pdfUrls[`student_${status.student.id}_pass`]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline ml-2"
                          >
                            View Pass
                          </a>
                        )}
                        {pdfUrls[`student_${status.student.id}_fail`] && (
                          <a
                            href={pdfUrls[`student_${status.student.id}_fail`]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline ml-2"
                          >
                            View Fail
                          </a>
                        )}
                        {pdfUrls[`student_${status.student.id}_conditional`] && (
                          <a
                            href={pdfUrls[`student_${status.student.id}_conditional`]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline ml-2"
                          >
                            View Conditional
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="b-text-message">{errors.statuses || 'No students found for this level and academic year'}</p>
            )}
          </div>
        )}

        {modal.show && (
          <Modal onClose={closeModal}>
            <h3 className="text-lg font-bold mb-4">Confirm PDF Generation</h3>
            <p>
              Are you sure you want to generate the{' '}
              {modal.action?.includes('pass') ? 'Pass' : modal.action?.includes('fail') ? 'Fail' : 'Conditional'} PDF for{' '}
              {modal.statusId
                ? `${statuses.find((s) => s.id === modal.statusId)?.student.firstName} ${statuses.find((s) => s.id === modal.statusId)?.student.lastName}`
                : 'the entire level'}?
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <button className="p-2 bg-gray-300 rounded" onClick={closeModal}>
                Cancel
              </button>
              <button className="p-2 bg-blue-500 text-white rounded" onClick={handleConfirmModal}>
                Okay
              </button>
            </div>
          </Modal>
        )}

        {loading && selectedLevelId && selectedAcademicYearId && (
          <p className="b-text-message">Loading students...</p>
        )}
        {(!selectedLevelId || !selectedAcademicYearId) && (
          <p className="b-text-message">Please select a level and academic year</p>
        )}
      </div>
    </BomiTheme>
  );
};

export default BReportCardPage;