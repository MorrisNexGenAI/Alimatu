// C:\Users\USER\Desktop\GradeSheet\SchoolGradesSystem\src\components\grade_sheets\GradeSheetTable.tsx
import React from 'react';
import type { GradeSheet } from '../../api/grade_sheets';
import type { Subject, Period } from '../../types';

interface GradeSheetTableProps {
  gradesheets: GradeSheet[];
  subjects: Subject[];
  periods: Period[];
}

const GradeSheetTable: React.FC<GradeSheetTableProps> = ({ gradesheets, subjects }) => {
  const fixedSubjects = subjects.map((s) => s.subject); // Use subjects from API

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="b-gradesheet-table-container">
      <button
        className="b-print-button"
        onClick={handlePrint}
      >
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
          {fixedSubjects.map((subjectName) => {
            const subjectData = gradesheets[0]?.subjects.find((s) => s.subject_name === subjectName) || {
              subject_name: subjectName,
              '1st': null,
              '2nd': null,
              '3rd': null,
              '1exam': null,
              '4th': null,
              '5th': null,
              '6th': null,
              '2exam': null,
              sem1_avg: null,
              sem2_avg: null,
              final_avg: null,
            };
            return (
              <tr key={subjectName} className="border">
                <td className="p-2">{subjectData.subject_name}</td>
                <td className="p-2 text-center">{subjectData['1st'] ?? '-'}</td>
                <td className="p-2 text-center">{subjectData['2nd'] ?? '-'}</td>
                <td className="p-2 text-center">{subjectData['3rd'] ?? '-'}</td>
                <td className="p-2 text-center">{subjectData['1exam'] ?? '-'}</td>
                <td className="p-2 text-center">{subjectData.sem1_avg ?? '-'}</td>
                <td className="p-2 text-center">{subjectData['4th'] ?? '-'}</td>
                <td className="p-2 text-center">{subjectData['5th'] ?? '-'}</td>
                <td className="p-2 text-center">{subjectData['6th'] ?? '-'}</td>
                <td className="p-2 text-center">{subjectData['2exam'] ?? '-'}</td>
                <td className="p-2 text-center">{subjectData.sem2_avg ?? '-'}</td>
                <td className="p-2 text-center">{subjectData.final_avg ?? '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default GradeSheetTable;