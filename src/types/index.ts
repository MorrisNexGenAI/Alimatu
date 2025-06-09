export interface GradeSheetEntry {
  student: number;
  student_id: number;
  student_name: string;
  id: number;
  enrollment_id: number; // ForeignKey to Enrollment
  subject_id: number;    // ForeignKey to Subject
  period_id: number;     // ForeignKey to Period
  score: number | null;
}

export interface Subject {
  id: number;
  subject: string;
}

export interface Period {
  id: number;
  period: string;
}

export interface Level {
  id: number;
  name: string;
}
export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F' | 'O';
  dob: string;
  level_id: number;
  level:any // Optional for backward compatibility
  academic_year: { id: number; name: string };
}
export interface AcademicYear {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
}
export interface GradeSheet {
  student_id: number;
  student_name: string;
  subjects: {
    first_period: string;
    second_period: string;
    third_period: string;
    first_exam: string;
    fourth_period: string;
    fifth_period: string;
    sixth_period: string;
    second_exam: string;
    subject_id: number;
    subject_name: string;
    '1st'?: number | string;
    '2nd'?: number | string;
    '3rd'?: number | string;
    '1exam'?: number | string;
    sem1_avg?: number | string;
    '4th'?: number | string;
    '5th'?: number | string;
    '6th'?: number | string;
    '2exam'?: number | string;
    sem2_avg?: number | string;
    final_avg?: number | string;
  }[];
}