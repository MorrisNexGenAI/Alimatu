import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const GradeSheetPrint = () => {
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Bomi_Junior_High_Grade_Sheet_2025-2026',
  });

  type Scores = Record<string, { '2nd'?: number }>;
  const students: { id: number; name: string; sex: string; grade: number; scores: Scores }[] = [
    { id: 22, name: 'Rachel Johnson', sex: 'F', grade: 28, scores: { 'Math': { '2nd': 78 } } },
    { id: 25, name: 'James Devine', sex: 'M', grade: 28, scores: { 'Math': { '2nd': 98 } } },
  ];

  const subjects = ['Math', 'Science', 'English', 'History', 'Geography', 'Civics', 'Literature', 'R.M.E', 'Agriculture', 'Vocab'];

  return (
    <div className="p-4">
      <button
        onClick={handlePrint}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Print Grade Sheet
      </button>

      {students.map((student, index) => (
        <div key={student.id} ref={index === 0 ? componentRef : null} className="mt-6 break-before-page">
          <div className="text-center">
            <h1 className="text-2xl font-bold">[LOGO] BOMI JUNIOR HIGH SCHOOL [LOGO]</h1>
            <p>Gbalasuah Community, Tubmanburg, Bomi County, Liberia</p>
            <p className="font-bold">PUBLIC SCHOOL</p>
            <p className="font-bold">PERIOD GRADE SHEET - 2025/2026</p>
          </div>

          <div className="text-center mt-4">
            <p><strong>Student Name:</strong> <span className="underline">{student.name}</span></p>
            <p><strong>Sex:</strong> <span className="underline">{student.sex}</span> <span className="ml-4"><strong>Grade:</strong> <span className="underline">{student.grade}</span></span></p>
            <p><strong>Academic Year:</strong> <span className="underline">2025/2026</span></p>
          </div>

          <div className="mt-6 flex justify-between">
            <div className="w-1/2 pr-2">
              <h3 className="text-lg font-semibold">FIRST SEMESTER</h3>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">Subject</th>
                    <th className="border border-gray-300 p-2">1st</th>
                    <th className="border border-gray-300 p-2">2nd</th>
                    <th className="border border-gray-300 p-2">3rd</th>
                    <th className="border border-gray-300 p-2">Exam</th>
                    <th className="border border-gray-300 p-2">Sem. Avg.</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((subject) => (
                    <tr key={subject} className="border border-gray-300">
                      <td className="border border-gray-300 p-2">{subject}</td>
                      <td className="border border-gray-300 p-2"></td>
                      <td className="border border-gray-300 p-2">{student.scores[subject]?.['2nd'] || ''}</td>
                      <td className="border border-gray-300 p-2"></td>
                      <td className="border border-gray-300 p-2"></td>
                      <td className="border border-gray-300 p-2"></td>
                    </tr>
                  ))}
                  <tr className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-bold">Average</td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-bold">Rank</td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-bold">Days Present</td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-bold">Days Absent</td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-bold">Conduct</td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="w-1/2 pl-2">
              <h3 className="text-lg font-semibold">SECOND SEMESTER</h3>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">4th</th>
                    <th className="border border-gray-300 p-2">5th</th>
                    <th className="border border-gray-300 p-2">6th</th>
                    <th className="border border-gray-300 p-2">Exam</th>
                    <th className="border border-gray-300 p-2">Sem. Avg.</th>
                    <th className="border border-gray-300 p-2">Yrly. Avg.</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((subject) => (
                    <tr key={subject} className="border border-gray-300">
                      <td className="border border-gray-300 p-2"></td>
                      <td className="border border-gray-300 p-2"></td>
                      <td className="border border-gray-300 p-2"></td>
                      <td className="border border-gray-300 p-2"></td>
                      <td className="border border-gray-300 p-2"></td>
                      <td className="border border-gray-300 p-2"></td>
                    </tr>
                  ))}
                  <tr className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-bold">Average</td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-bold">Rank</td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-bold">Days Present</td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-bold">Days Absent</td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-bold">Conduct</td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {index < students.length - 1 && <div className="page-break" />}
        </div>
      ))}
    </div>
  );
};

export default GradeSheetPrint;