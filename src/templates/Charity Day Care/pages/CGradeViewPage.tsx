// C:\Users\USER\Desktop\GradeSheet\SchoolGradesSystem\src\pages\GradeViewPage.tsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useGrades } from '../../../hooks/useGrades';
import { useSubjects } from '../../../hooks/useSubjects';
import { usePeriods } from '../../../hooks/usePeriods';
import GradeSheetTable from '../../../components/grade_sheets/GradeSheetTable';
import BomiTheme from '../../../templates/Bomi junior High/bomi';
 import '../templates/Charity Day Care/b_gradesheets.css';

// Import the new CSS file

const GradeViewPage: React.FC = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const { gradesheets, loadGrades, loading: gradesLoading, error: gradesError } = useGrades();
  const { subjects, loadSubjects, loading: subjectsLoading, error: subjectsError } = useSubjects();
  const { periods, loadPeriods, loading: periodsLoading, error: periodsError } = usePeriods();

  useEffect(() => {
    if (levelId) {
      loadGrades(levelId);
    }
    loadSubjects();
    loadPeriods();
  }, [levelId, loadGrades, loadSubjects, loadPeriods]);

  useEffect(() => {
    if (gradesError) toast.error(gradesError);
    if (subjectsError) toast.error(subjectsError);
    if (periodsError) toast.error(periodsError);
  }, [gradesError, subjectsError, periodsError]);

  if (gradesLoading || subjectsLoading || periodsLoading) return <p className="b-gradesheet-message">Loading grades...</p>;

  return (
    <BomiTheme>
      <div className="b-gradesheet-page p-4">
        <h2 className="b-gradesheet-heading">Level Grade Sheet</h2>
        <GradeSheetTable gradesheets={gradesheets} subjects={subjects} periods={periods} />
        
      </div>
    </BomiTheme>
  );
};

export default GradeViewPage;