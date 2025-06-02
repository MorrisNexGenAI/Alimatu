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