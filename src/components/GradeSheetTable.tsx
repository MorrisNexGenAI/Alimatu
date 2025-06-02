import type { GradeSheetTableProps } from '../types';



const GradeSheetTable: React.FC<GradeSheetTableProps> = ({ gradesheets, subjects, periods }) => {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-200">
          <th className="border p-2">Subject</th>
          {periods.map((period) => (
            <th key={period.id} className="border p-2">{period.name}</th>
          ))}
          <th className="border p-2">Sem 1 Avg</th>
          <th className="border p-2">Sem 2 Avg</th>
          <th className="border p-2">Final Avg</th>
        </tr>
      </thead>
      <tbody>
        {subjects.map((subject) => {
          const gradesheet = gradesheets.find((g) => g.subjectId === subject.id);
          return (
            <tr key={subject.id} className="border">
              <td className="p-2">{subject.name}</td>
              {periods.map((period) => {
                const grade = gradesheet?.grades.find((g) => g.periodId === period.id);
                return (
                  <td key={period.id} className="p-2 text-center">
                    {grade ? grade.score : '-'}
                  </td>
                );
              })}
              <td className="p-2 text-center">{gradesheet?.sem1Avg ?? '-'}</td>
              <td className="p-2 text-center">{gradesheet?.sem2Avg ?? '-'}</td>
              <td className="p-2 text-center">{gradesheet?.finalAvg ?? '-'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default GradeSheetTable;