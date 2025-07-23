import React from 'react';
import GradeAverageCalculator from './GradeAvgCalculator';
import type { Period, Subject,GradeSheet, PdfUrls, PdfLoading } from '../../types';

interface GradeSheetTableProps {
  gradesheets: GradeSheet[];
  openModal?: (studentId: number | null, action: string) => void;
  pdfUrls?: PdfUrls;
  pdfLoading?: PdfLoading;
  subjects?:Subject[];
  periods?:Period[];
}

const periodMap: { [key: string]: string } = {
  '1st': 'first_period',
  '2nd': 'second_period',
  '3rd': 'third_period',
  '1exam': 'first_exam',
  '4th': 'fourth_period',
  '5th': 'fifth_period',
  '6th': 'sixth_period',
  '2exam': 'second_exam',
  '1a': 'sem1_avg',
  '2a': 'sem2_avg',
  'f': 'final_avg',
};

const GradeSheetTable: React.FC<GradeSheetTableProps> = ({ gradesheets, openModal, pdfUrls, pdfLoading }) => {
  if (!gradesheets.length) {
    return <p className="text-red-500 mt-4">No gradesheet data available</p>;
  }

  const fixedSubjects = gradesheets[0].subjects.map((s) => ({
    id: s.subject_id,
    name: s.subject_name,
  }));

  if (!fixedSubjects.length) {
    return <p className="text-red-500 mt-4">No subjects available for this student</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Gradesheet for {gradesheets[0].student_name} (Status: {gradesheets[0].status || 'PENDING'})
        </h3>
        <div className="flex items-center gap-3">
          <button
            className={`bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors ${
              pdfLoading?.[`student_${gradesheets[0].student_id}`] ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => openModal?.(gradesheets[0].student_id, 'print')}
            disabled={pdfLoading?.[`student_${gradesheets[0].student_id}`]}
          >
            {pdfLoading?.[`student_${gradesheets[0].student_id}`] ? 'Generating...' : 'Generate Periodic PDF'}
          </button>
          {pdfUrls?.[`student_${gradesheets[0].student_id}`] && (
            <a
              href={pdfUrls[`student_${gradesheets[0].student_id}`]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              View PDF
            </a>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left font-medium text-gray-700">Subject</th>
              <th className="border p-2 text-center font-medium text-gray-700">1st</th>
              <th className="border p-2 text-center font-medium text-gray-700">2nd</th>
              <th className="border p-2 text-center font-medium text-gray-700">3rd</th>
              <th className="border p-2 text-center font-medium text-gray-700">1st Exam</th>
              <th className="border p-2 text-center font-medium text-gray-700">1st Sem Avg</th>
              <th className="border p-2 text-center font-medium text-gray-700">4th</th>
              <th className="border p-2 text-center font-medium text-gray-700">5th</th>
              <th className="border p-2 text-center font-medium text-gray-700">6th</th>
              <th className="border p-2 text-center font-medium text-gray-700">2nd Exam</th>
              <th className="border p-2 text-center font-medium text-gray-700">2nd Sem Avg</th>
              <th className="border p-2 text-center font-medium text-gray-700">Final Avg</th>
            </tr>
          </thead>
          <tbody>
            {fixedSubjects.map(({ id, name }) => {
              const subjectData = gradesheets[0].subjects.find((s) => s.subject_id === id) || {
                subject_id: id,
                subject_name: name,
                '1st': '-',
                '2nd': '-',
                '3rd': '-',
                '1exam': '-',
                '4th': '-',
                '5th': '-',
                '6th': '-',
                '2exam': '-',
                '1a': '-',
                '2a': '-',
                'f': '-',
              };
              const calculatedSubject = (
                <GradeAverageCalculator subject={subjectData} />
              ).props.subject as { [key: string]: string };
              const mappedData = Object.keys(calculatedSubject).reduce((acc, key) => {
                const mappedKey = periodMap[key] || key;
                acc[mappedKey] = calculatedSubject[key] || '-';
                return acc;
              }, {} as { [key: string]: string });
              return (
                <tr key={id} className="border-b hover:bg-gray-50">
                  <td className="border p-2 text-gray-800">{mappedData.subject_name}</td>
                  <td className="border p-2 text-center text-gray-600">{mappedData.first_period}</td>
                  <td className="border p-2 text-center text-gray-600">{mappedData.second_period}</td>
                  <td className="border p-2 text-center text-gray-600">{mappedData.third_period}</td>
                  <td className="border p-2 text-center text-gray-600">{mappedData.first_exam}</td>
                  <td className="border p-2 text-center text-gray-600">{mappedData.sem1_avg}</td>
                  <td className="border p-2 text-center text-gray-600">{mappedData.fourth_period}</td>
                  <td className="border p-2 text-center text-gray-600">{mappedData.fifth_period}</td>
                  <td className="border p-2 text-center text-gray-600">{mappedData.sixth_period}</td>
                  <td className="border p-2 text-center text-gray-600">{mappedData.second_exam}</td>
                  <td className="border p-2 text-center text-gray-600">{mappedData.sem2_avg}</td>
                  <td className="border p-2 text-center text-gray-600">{mappedData.final_avg}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradeSheetTable;