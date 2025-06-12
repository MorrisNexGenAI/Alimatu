import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRefresh } from '../context/RefreshContext';
import { getStatusesByLevelAndYear, validateStatus, promoteStudent, printReportCard } from '../api/pass_failed_statues';
import { getLevels } from '../api/levels';
import { getAcademicYears } from '../api/academic_years';
import type { Level, AcademicYear, PassFailedStatus } from '../types';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';
import BomiTheme from '../templates/Bomi junior High/bomi';
import './b_gradesheets.css';

const ReportCard: React.FC = () => {
  const { refresh, setRefresh } = useRefresh();
  const [levels, setLevels] = useState<Level[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<number | null>(null);
  const [statuses, setStatuses] = useState<PassFailedStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [pdfUrls, setPdfUrls] = useState<{ [key: string]: string }>({});
  const [modal, setModal] = useState<{ show: boolean; statusId?: number; action?: string }>({ show: false });

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [levelData, yearData] = await Promise.all([
          getLevels(),
          getAcademicYears(),
        ]);
        setLevels(levelData);
        setAcademicYears(yearData);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load initial data';
        toast.error(`${message}`);
        setErrors((prev) => ({ ...prev, initial: message }));
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!selectedLevelId || !selectedAcademicYearId) {
      setStatuses([]);
      setPdfUrls({});
      return;
    }

    const fetchStatuses = async () => {
      setLoading(true);
      try {
        const statusData = await getStatusesByLevelAndYear(selectedLevelId, selectedAcademicYearId);
        setStatuses(statusData);
        setErrors((prev) => ({ ...prev, statuses: '' }));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load student statuses';
        toast.error(`${message}`);
        setErrors((prev) => ({ ...prev, statuses: message }));
      } finally {
        setLoading(false);
      }
    };
    fetchStatuses();
  }, [selectedLevelId, selectedAcademicYearId, refresh]);

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedLevelId(Number(e.target.value) || null);
    setRefresh((prev: number) => prev + 1);
  };

  const handleAcademicYearChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedAcademicYearId(Number(e.target.value) || null);
    setRefresh((prev: number) => prev + 1);
  };

  const handleSetStatus = async (statusId: number, status: 'PASS' | 'FAIL' | 'CONDITIONAL'): Promise<void> => {
    try {
      await validateStatus(statusId, status, 'admin');
      toast.success(`Student marked as ${status.toLowerCase()}`);
      setRefresh((prev: number) => prev + 1);
      setModal({ show: false });
    } catch (err) {
      toast.error(`Failed to set status: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handlePromote = async (statusId: number): Promise<void> => {
    try {
      await promoteStudent(statusId);
      toast.success('Student promoted to next level');
      setRefresh((prev: number) => prev + 1);
      setModal({ show: false });
    } catch (err) {
      toast.error(`Failed to promote: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleGeneratePDF = async (statusId?: number): Promise<void> => {
    try {
      const response = await printReportCard(selectedLevelId!, selectedAcademicYearId!, statusId ? statuses.find(s => s.id === statusId)?.student.id : undefined);
      const key = statusId ? `status_${statusId}` : `level_${selectedLevelId}`;
      setPdfUrls((prev) => ({ ...prev, [key]: response.view_url }));
      toast.success('PDF generated successfully! Click the link to view.');
    } catch (err) {
      toast.error(`Failed to generate PDF: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const openModal = (statusId: number | null, action: string): void => {
    setModal({ show: true, statusId: statusId || undefined, action });
  };

  const closeModal = (): void => {
    setModal({ show: false });
  };

  const allStatusesReady = statuses.length > 0 && statuses.every(
    (s) => s.grades_complete && s.status !== 'INCOMPLETE'
  );

  if (loading && !selectedLevelId) {
    return <p className="b-gradesheet-message">Loading data...</p>;
  }

  return (
    <BomiTheme>
      <div className="b-gradesheet-page p-4">
        <h2 className="b-gradesheet-title">Yearly Report Card Management</h2>

        <div className="flex space-x-4 mb-4">
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
                          Failed
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
              <p className="b-gradesheet-message">{errors.statuses || 'No students found for this level and year'}</p>
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
              <button
                className="p-2 bg-blue-500 text-white rounded"
                onClick={() => {
                  if (modal.action === 'print') {
                    handleGeneratePDF(modal.statusId);
                  } else if (modal.action === 'promote') {
                    handlePromote(modal.statusId!);
                  } else if (modal.action === 'print_level') {
                    handleGeneratePDF();
                  } else {
                    handleSetStatus(modal.statusId!, modal.action as 'PASS' | 'FAIL' | 'CONDITIONAL');
                  }
                }}
              >
                Confirm
              </button>
            </div>
          </Modal>
        )}

        {loading && selectedLevelId && <p className="b-gradesheet-message">Loading students...</p>}
        {(!selectedLevelId || !selectedAcademicYearId) && (
          <p className="b-gradesheet-message">Please select a level and academic year</p>
        )}
      </div>
    </BomiTheme>
  );
};

export default ReportCard;
