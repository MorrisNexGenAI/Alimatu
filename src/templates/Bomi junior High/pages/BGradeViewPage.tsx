import React from 'react';
import { useGradeView } from '../../../hooks/useGradeView';
import GradeSheetTable from '../../../components/grade_sheets/GradeSheetTable';
import BomiTheme from '../bomi';
import './b_gradesheets.css';


const BGradeViewPage: React.FC = () => {
  const { gradesheets, subjects, periods, loading } = useGradeView();

  if (loading) {
    return <p className="b-gradesheet-message">Loading grades...</p>;
  }

  return (
    <BomiTheme>
      <div className="b-gradesheet-page p-4">
        <h2 className="b-gradesheet-heading">Level Grade Sheet</h2>
        <GradeSheetTable gradesheets={gradesheets} subjects={subjects} periods={periods} />
      </div>
    </BomiTheme>
  );
};

export default BGradeViewPage;