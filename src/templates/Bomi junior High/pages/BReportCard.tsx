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
    modal,
    allStatusesReady,
    handleLevelChange,
    handleAcademicYearChange,
    handleGeneratePDF,
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
          <div className="mt-4">
            <button
              className="b-generate-btn p-2 bg-blue-500 text-white rounded"
              onClick={() => openModal(null, 'print_level')}
              disabled={loading || !allStatusesReady}
            >
              Print Level Report Cards
            </button>
            {pdfUrls[`level_${selectedLevelId}`] && (
              <p className="mt-2">
                <a
                  href={pdfUrls[`level_${selectedLevelId}`]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Level PDFs
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
                          onClick={() => openModal(status.id, 'PASS')}
                          disabled={loading || !status.grades_complete}
                        >
                          Pass
                        </button>
                        <button
                          className="p-1 bg-red-500 text-white rounded text-sm"
                          onClick={() => openModal(status.id, 'FAIL')}
                          disabled={loading || !status.grades_complete}
                        >
                          Fail
                        </button>
                        <button
                          className="p-1 bg-yellow-500 text-white rounded text-sm"
                          onClick={() => openModal(status.id, 'CONDITIONAL')}
                          disabled={loading || !status.grades_complete}
                        >
                          Conditional
                        </button>
                        <button
                          className="p-1 bg-gray-500 text-white rounded text-sm"
                          onClick={() => openModal(status.id, 'print')}
                          disabled={loading || status.status === 'INCOMPLETE'}
                        >
                          Print
                        </button>
                        <button
                          className="p-1 bg-blue-500 text-white rounded text-sm"
                          onClick={() => openModal(status.id, 'promote')}
                          disabled={loading || (status.status !== 'PASS' && status.status !== 'CONDITIONAL')}
                        >
                          Promote
                        </button>
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
            <h3 className="text-lg font-bold mb-4">Confirm Action</h3>
            <p>
              Are you sure you want to{' '}
              {modal.action === 'print'
                ? 'print the report card for'
                : modal.action === 'promote'
                ? 'promote'
                : modal.action === 'print_level'
                ? 'print all report cards for this level'
                : `mark as ${modal.action?.toLowerCase() || ''}`}
              {modal.statusId
                ? ` ${statuses.find((s) => s.id === modal.statusId)?.student.firstName} ${statuses.find((s) => s.id === modal.statusId)?.student.lastName}`
                : ''}?
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