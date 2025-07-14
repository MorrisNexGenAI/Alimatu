import { Errors } from "../hooks/useGradeSheets";

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
  period_id: number;
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
  is_exam?: boolean;
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
  view_url: any;
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface GradeSheet {
  student_id: number;
  student_name: string;
  status: string;
  subjects: {
    subject_id: string;
    subject_name: string;
    first_period: string;
    second_period: string;
    third_period: string;
    first_exam: string;
    fourth_period: string;
    fifth_period: string;
    sixth_period: string;
    second_exam: string;
    sem1_avg: string;
    sem2_avg: string;
    final_avg: string;
    '1st': string;
    '2nd': string;
    '3rd': string;
    '1exam': string;
    '4th': string;
    '5th': string;
    '6th': string;
    '2exam': string;
    '1a': string;
    '2a': string;
    'f': string;
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
  academic_year: number | string;
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

export interface PdfLoading {
  [key: string]: boolean;
}

export interface PdfUrls {
  [key: string]: string;
}

export interface UseGradeSheetsReturn {
  levels: Level[];
  academicYears: AcademicYear[];
  subjects: Subject[];
  periods: Period[];
  selectedLevelId: number | null;
  selectedAcademicYearId: number | null;
  selectedSubjectId: number | null;
  selectedPeriodId: number | null;
  students: Student[];
  gradeSheets: GradeSheet[];
  loading: boolean;
  pdfLoading: PdfLoading;
  errors: Errors;
  pdfUrls: PdfUrls;
  modal: { show: boolean; studentId?: number; action?: string };
  handleLevelChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleAcademicYearChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleGeneratePDF: (levelId: number, studentId?: number) => Promise<void>;
  openModal: (studentId: number | null, action: string) => void;
  closeModal: () => void;
  handleConfirmModal: () => Promise<void>;
}

export interface UseReportCardReturn {
  levels: Level[];
  academicYears: AcademicYear[];
  selectedLevelId: number | null;
  selectedAcademicYearId: number | null;
  statuses: PassFailedStatus[];
  loading: boolean;
  pdfLoading: {[key:string]:boolean}
  handleGenerateYearlyPDF: (status:"pass" | "fail" | "conditional", studentid?:number)=>Promise<void>;
  errors: { [key: string]: string };
  pdfUrls: PdfUrls;
  modal: { show: boolean; statusId?: number; action?: string };
  allStatusesReady: boolean;
  handleLevelChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleAcademicYearChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSetStatus?: (statusId: number, status: 'PASS' | 'FAIL' | 'CONDITIONAL') => Promise<void>;
  handleGeneratePDF?: (studentId?: number) => Promise<void>;
  handlePromoteStudent?: (statusId: number) => Promise<void>;
  handleConfirmModal: () => Promise<void>;
  openModal: (statusId: number | null, action: string) => void;
  closeModal: () => void;
}

export interface AdminManagement {
  subjects: Subject[];
}

export type AdminPageSection<T> = {
  title: string;
  FormComponent: React.FC<{
    onSuccess: () => void;
    editingItem?: T | null;
    onCancel?: () => void;
  }>;
  ListComponent: React.FC<{
    onEdit: (item: T) => void;
    onDelete: (item: T) => void;
  }>;
};

export type AdminPageProps<T> = {
  sections: AdminPageSection<T>[];
}; 