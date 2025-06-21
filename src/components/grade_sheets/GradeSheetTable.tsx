
import React from 'react';
import type { Subject, Period, GradeSheet } from '../../types';

interface GradeSheetTableProps {
  gradesheets: GradeSheet[];
  subjects: Subject[];
  periods: Period[];
}

const GradeSheetTable: React.FC<GradeSheetTableProps> = ({ gradesheets, subjects }) => {
  const handlePrint = () => {
    window.print();
  };

  if (!gradesheets.length) {
    return <p>No gradesheet data available</p>;
  }

  // Use transformed subjects directly from gradesheets
  const fixedSubjects = gradesheets[0].subjects.map((s) => ({
    id: Number(s.subject_id), // Convert string to number
    name: s.subject_name,
  }));

  if (!fixedSubjects.length) {
    return <p>No subjects available for this student</p>;
  }

  return (
    <div className="b-gradesheet-table-container">
      <button className="b-print-button" onClick={handlePrint}>
        Print Grade Sheet
      </button>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Subjects</th>
            <th className="border p-2">1st Period</th>
            <th className="border p-2">2nd Period</th>
            <th className="border p-2">3rd Period</th>
            <th className="border p-2">1st Semester Exam</th>
            <th className="border p-2">1st Semester Avg</th>
            <th className="border p-2">4th Period</th>
            <th className="border p-2">5th Period</th>
            <th className="border p-2">6th Period</th>
            <th className="border p-2">Final Exam</th>
            <th className="border p-2">2nd Semester Avg</th>
            <th className="border p-2">Final Avg</th>
          </tr>
        </thead>
        <tbody>
          {fixedSubjects.map(({ id, name }) => {
            const subjectData = gradesheets[0].subjects.find((s) => Number(s.subject_id) === id) || {
              subject_id: id.toString(),
              subject_name: name,
              first_period: '',
              second_period: '',
              third_period: '',
              first_exam: '',
              fourth_period: '',
              fifth_period: '',
              sixth_period: '',
              second_exam: '',
              sem1_avg: '',
              sem2_avg: '',
              final_avg: '',
            };
            return (
              <tr key={id} className="border">
                <td className="p-2">{subjectData.subject_name}</td>
                <td className="p-2 text-center">{subjectData.first_period || '-'}</td>
                <td className="p-2 text-center">{subjectData.second_period || '-'}</td>
                <td className="p-2 text-center">{subjectData.third_period || '-'}</td>
                <td className="p-2 text-center">{subjectData.first_exam || '-'}</td>
                <td className="p-2 text-center">{subjectData.sem1_avg || '-'}</td>
                <td className="p-2 text-center">{subjectData.fourth_period || '-'}</td>
                <td className="p-2 text-center">{subjectData.fifth_period || '-'}</td>
                <td className="p-2 text-center">{subjectData.sixth_period || '-'}</td>
                <td className="p-2 text-center">{subjectData.second_exam || '-'}</td>
                <td className="p-2 text-center">{subjectData.sem2_avg || '-'}</td>
                <td className="p-2 text-center">{subjectData.final_avg || '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default GradeSheetTable;
