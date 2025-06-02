import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGrades } from '../hooks/useGrades';
import { useSubjects } from '../hooks/useSubjects';
import { usePeriods } from '../hooks/usePeriods';
import GradeSheetTable from '../components/GradeSheetTable';
import toast from 'react-hot-toast';

const GradeViewPage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const { gradesheets, loadGrades, loading: gradesLoading, error: gradesError } = useGrades();
  const { subjects, loadSubjects, loading: subjectsLoading, error: subjectsError } = useSubjects();
  const { periods, loadPeriods, loading: periodsLoading, error: periodsError } = usePeriods();

  useEffect(() => {
    if (studentId) {
      loadGrades(studentId);
    }
    loadSubjects();
    loadPeriods();
  }, [studentId, loadGrades, loadSubjects, loadPeriods]);

  useEffect(() => {
    if (gradesError) toast.error(gradesError);
    if (subjectsError) toast.error(subjectsError);
    if (periodsError) toast.error(periodsError);
  }, [gradesError, subjectsError, periodsError]);

  if (gradesLoading || subjectsLoading || periodsLoading) return <p className="text-center">Loading grades...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Student Gradesheet</h2>
      <GradeSheetTable gradesheets={gradesheets} subjects={subjects} periods={periods} />
    </div>
  );
};

export default GradeViewPage;