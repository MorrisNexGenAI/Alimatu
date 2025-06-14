export interface Grade {
  id?: number;
  student_id: number;
  subject_id: number;
  period_id: number;
  score: number;
  enrollment_id?: number;
}

export interface GradeSheetEntry {
  student: any;
  id?: number;
  student_id: number;
  student_name: string;
  subject_id: number;
  period_id?: number;
  score: number | null;
}

export interface Subject {
  level: any;
  subject: any;
  id: number;
  name: string;
}

export interface Period {
  period: any;
  id: number;
  name: string;
}

export interface Level {
  id: number;
  name: string;
  order?: number;
}

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F' | 'O';
  dob: string;
  level_id: number;
  level: number | { id: number } | null;
  academic_year: number | { id: number; name: string };
}

export interface AcademicYear {
  id: number;
  name: string;
  start_date?: string;
  end_date?: string;
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

export interface Enrollment {
  id: number;
  student: Student;
  level: Level;
  academic_year: AcademicYear;
}

export interface PassFailedStatus {
  id: number;
  student: {
    id: number;
    firstName: string;
    lastName: string;
  };
  level_id: number;
  academic_year: {
    id: number;
    name: string;
  };
  enrollment?: { id: number };
  grades_complete: boolean;
  status: 'PASS' | 'FAIL' | 'CONDITIONAL' | 'PENDING' | 'INCOMPLETE';
  validated_by?: string;
  template_name?: string;
}