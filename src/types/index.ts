
export interface GradeSheetEntry {
  student_id: number; // Match backend
  student_name: string; // Match backend
  score: number | null;
}
export interface Subject {
  id: number;
  subject: string; // Backend uses "subject" instead of "name"
}

export interface Period {
  id: number;
  period: string; // Backend uses "period" (e.g., "1st", "2nd")
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
  level_id: number; // Updated from level
  created_at?: string;
}