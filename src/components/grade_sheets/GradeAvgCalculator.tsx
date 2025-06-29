
import React from 'react';

interface Subject {
  subject_id: string;
  subject_name: string;
  '1st': string;
  '2nd': string;
  '3rd': string;
  '1exam': string;
  '1a': string;
  '4th': string;
  '5th': string;
  '6th': string;
  '2exam': string;
  '2a': string;
  'f': string;
}

interface GradeAverageCalculatorProps {
  subject: Subject;
}

const GradeAverageCalculator: React.FC<GradeAverageCalculatorProps> = ({ subject }) => {
  const calculateAverages = (data: Subject): Subject => {
    const updatedSubject = { ...data };
    try {
      // Calculate 1a: ((1st + 2nd + 3rd) / 3 + 1exam) / 2
      const sem1Grades = [data['1st'], data['2nd'], data['3rd'], data['1exam']];
      console.log(`Sem1 Grades for ${data.subject_name}:`, sem1Grades);
      if (sem1Grades.every(g => g !== '-' && !isNaN(parseInt(g)))) {
        const sem1PeriodAvg = (parseInt(sem1Grades[0]) + parseInt(sem1Grades[1]) + parseInt(sem1Grades[2])) / 3;
        updatedSubject['1a'] = Math.floor((sem1PeriodAvg + parseInt(sem1Grades[3])) / 2).toString();
        console.log(`Calculated 1a for ${data.subject_name}: ${updatedSubject['1a']}`);
      }

      // Calculate 2a: ((4th + 5th + 6th) / 3 + 2exam) / 2
      const sem2Grades = [data['4th'], data['5th'], data['6th'], data['2exam']];
      console.log(`Sem2 Grades for ${data.subject_name}:`, sem2Grades);
      if (sem2Grades.every(g => g !== '-' && !isNaN(parseInt(g)))) {
        const sem2PeriodAvg = (parseInt(sem2Grades[0]) + parseInt(sem2Grades[1]) + parseInt(sem2Grades[2])) / 3;
        updatedSubject['2a'] = Math.floor((sem2PeriodAvg + parseInt(sem2Grades[3])) / 2).toString();
        console.log(`Calculated 2a for ${data.subject_name}: ${updatedSubject['2a']}`);
      }

      // Calculate f: (1a + 2a) / 2
      if (
        updatedSubject['1a'] !== '-' && updatedSubject['2a'] !== '-' &&
        !isNaN(parseInt(updatedSubject['1a'])) && !isNaN(parseInt(updatedSubject['2a']))
      ) {
        updatedSubject['f'] = Math.floor(
          (parseInt(updatedSubject['1a']) + parseInt(updatedSubject['2a'])) / 2
        ).toString();
        console.log(`Calculated f for ${data.subject_name}: ${updatedSubject['f']}`);
      }
    } catch (e) {
      console.error(`Error calculating averages for ${data.subject_name}:`, e);
    }
    return updatedSubject;
  };

  const calculatedSubject = calculateAverages(subject);
  return <>{JSON.stringify(calculatedSubject)}</>; // Placeholder for integration
};

export default GradeAverageCalculator;
