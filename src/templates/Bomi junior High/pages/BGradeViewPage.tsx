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
        <GradeSheetTable
          gradesheets={gradesheets.map(gs => ({
            ...gs,
            subjects: gs.subjects.map(subj => ({
              first_period: subj['1st']?.toString() ?? '',
              second_period: subj['2nd']?.toString() ?? '',
              third_period: subj['3rd']?.toString() ?? '',
              first_exam: subj['1exam']?.toString() ?? '',
              fourth_period: subj['4th']?.toString() ?? '',
              fifth_period: subj['5th']?.toString() ?? '',
              sixth_period: subj['6th']?.toString() ?? '',
              second_exam: subj['2exam']?.toString() ?? '',
              subject_id: subj.subject_id,
              subject_name: subj.subject_name,
              sem1_avg: subj.sem1_avg?.toString() ?? '',
              sem2_avg: subj.sem2_avg?.toString() ?? '',
              final_avg: subj.final_avg?.toString() ?? '',
            }))
          }))}
          subjects={subjects}
          periods={periods}
        />
      </div>
    </BomiTheme>
  );
};

export default BGradeViewPage;