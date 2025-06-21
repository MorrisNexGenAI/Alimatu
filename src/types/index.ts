export interface Grade {
  id?: number;
  student_id: number;
  subject_id: number;
  period_id: number;
  score: number;
  enrollment_id?: number;
}

export interface GradeSheetEntry {
  student: Student;
  id?: number;
  student_id: number;
  student_name: string;
  subject_id: number;
  period_id?: number;
  score: number | null;
}

export interface Subject {
  id: number;
  subject: string;
  level_id: number;
}

export interface Period {
  id: number;
  period: string;
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
  level: number | { id: number; name: string } | null;
  academic_year: number | { id: number; name: string };
}

export interface AcademicYear {
  id: number;
  name: string;
  start_date?: string;
  end_date?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface GradeSheet {
  student_id: number;
  student_name: string;
  subjects: {
    subject_id: string;
    subject_name: string;
    first_period?: string;
    second_period?: string;
    third_period?: string;
    first_exam?: string;
    fourth_period?: string;
    fifth_period?: string;
    sixth_period?: string;
    second_exam?: string;
    sem1_avg?: string;
    sem2_avg?: string;
    final_avg?: string;
    // Backend fields
    '1st'?: number | null;
    '2nd'?: number | null;
    '3rd'?: number | null;
    '1exam'?: number | null;
    '4th'?: number | null;
    '5th'?: number | null;
    '6th'?: number | null;
    '2exam'?: number | null;
    '1s'?: number | null;
    '2s'?: number | null;
    'f'?: number | null;
  }[];
}

export interface Enrollment {
  id: number;
  student: Student;
  level: Level;
  academic_year: AcademicYear;
  date_enrolled: string;
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

export interface GradeEntry {
  student_id: number;
  score: number | null;
  period_id: number;
}

export interface PostGradesData {
  level: number;
  subject_id: number;
  period_id: number;
  academic_year: string;
  grades: GradeEntry[];
}

export interface GradeResponse {
  message: string;
  saved_grades: number[];
  skipped_students: number[];
  errors: { student_id: number; error: string }[];
}

export interface ExistingGrade {
  student_id: number;
  student_name: string;
  score: number | null;
  period_id: number;
}

export interface StudentEnrollmentData {
  firstName: string;
  lastName: string;
  gender: 'M' | 'F' | 'O';
  dob: string;
  level_id: number;
  academic_year_id: number;
  date_enrolled: string;
}

export interface PdfResponse {
  view_url: string;
  message?: string;
  pdf_path?: string;
}