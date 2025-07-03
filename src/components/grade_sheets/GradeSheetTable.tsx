import React from 'react';
import GradeAverageCalculator from './GradeAvgCalculator';
import type { GradeSheet, PdfUrls, PdfLoading } from '../../types';

interface GradeSheetTableProps {
  gradesheets: GradeSheet[];
  openModal?: (studentId: number | null, action: string) => void;
  pdfUrls?: PdfUrls;
  pdfLoading?: PdfLoading;
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
  console.log('Raw GradeSheets Input:', JSON.stringify(gradesheets, null, 2));

  if (!gradesheets.length) {
    return <p className="text-warning mt-4">No gradesheet data available</p>;
  }

  const fixedSubjects = gradesheets[0].subjects.map((s) => ({
    id: s.subject_id,
    name: s.subject_name,
  }));

  console.log('Fixed Subjects:', JSON.stringify(fixedSubjects, null, 2));

  if (!fixedSubjects.length) {
    return <p className="text-warning mt-4">No subjects available for this student</p>;
  }

  return (
    <div className="b-gradesheet-table-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Gradesheet for {gradesheets[0].student_name} (Status: {gradesheets[0].status || 'PENDING'})</h1>
        <div>
          <button
            className={`b-print-button btn btn-info ${pdfLoading?.[`student_${gradesheets[0].student_id}`] ? 'opacity-50' : ''}`}
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
              className="ml-2 text-blue-500 underline text-sm"
            >
              View PDF
            </a>
          )}
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered table-hover w-full border-collapse">
          <thead className="table-light">
            <tr>
              <th scope="col" className="border p-2">Subject</th>
              <th scope="col" className="border p-2">1st Period</th>
              <th scope="col" className="border p-2">2nd Period</th>
              <th scope="col" className="border p-2">3rd Period</th>
              <th scope="col" className="border p-2">1st Semester Exam</th>
              <th scope="col" className="border p-2">1st Semester Avg</th>
              <th scope="col" className="border p-2">4th Period</th>
              <th scope="col" className="border p-2">5th Period</th>
              <th scope="col" className="border p-2">6th Period</th>
              <th scope="col" className="border p-2">2nd Semester Exam</th>
              <th scope="col" className="border p-2">2nd Semester Avg</th>
              <th scope="col" className="border p-2">Final Avg</th>
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
                '1a': '-',
                '4th': '-',
                '5th': '-',
                '6th': '-',
                '2exam': '-',
                '2a': '-',
                'f': '-',
              };
              console.log(`Raw Subject Data for ${name}:`, JSON.stringify(subjectData, null, 2));
              const calculatedSubject = (
                <GradeAverageCalculator subject={subjectData} />
              ).props.subject as { [key: string]: string };
              const mappedData = Object.keys(calculatedSubject).reduce((acc, key) => {
                const mappedKey = periodMap[key] || key;
                acc[mappedKey] = calculatedSubject[key] || '-';
                return acc;
              }, {} as { [key: string]: string });
              console.log(`Mapped Data for subject ${name}:`, JSON.stringify(mappedData, null, 2));
              return (
                <tr key={id} className="border">
                  <td className="p-2">{mappedData.subject_name}</td>
                  <td className="p-2 text-center">{mappedData.first_period}</td>
                  <td className="p-2 text-center">{mappedData.second_period}</td>
                  <td className="p-2 text-center">{mappedData.third_period}</td>
                  <td className="p-2 text-center">{mappedData.first_exam}</td>
                  <td className="p-2 text-center">{mappedData.sem1_avg}</td>
                  <td className="p-2 text-center">{mappedData.fourth_period}</td>
                  <td className="p-2 text-center">{mappedData.fifth_period}</td>
                  <td className="p-2 text-center">{mappedData.sixth_period}</td>
                  <td className="p-2 text-center">{mappedData.second_exam}</td>
                  <td className="p-2 text-center">{mappedData.sem2_avg}</td>
                  <td className="p-2 text-center">{mappedData.final_avg}</td>
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