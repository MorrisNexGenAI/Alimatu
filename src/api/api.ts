
  // api.ts
export const getLevels = async (): Promise<{ id: number; name: string }[]> => {
  const response = await fetch('http://localhost:8000/api/levels/');
  if (!response.ok) throw new Error('Failed to load levels');
  return response.json();
};

export const getStudents = async (): Promise<{ id: number; firstName: string; lastName: string; level_id: number }[]> => {
  const response = await fetch('http://localhost:8000/api/students/');
  if (!response.ok) throw new Error('Failed to load students');
  return response.json();
};

export const getStudentsByLevel = async (levelId: number): Promise<{ id: number; firstName: string; lastName: string; level_id: number }[]> => {
  const response = await fetch(`http://localhost:8000/api/students/?level_id=${levelId}`);
  if (!response.ok) throw new Error('Failed to load students by level');
  return response.json();
};

export const getSubjects = async (): Promise<{ id: number; subject: string; level_id: number }[]> => {
  const response = await fetch('http://localhost:8000/api/subjects/');
  if (!response.ok) throw new Error('Failed to load subjects');
  return response.json();
};

export const getSubjectsByLevel = async (levelId: number): Promise<{ id: number; subject: string; level_id: number }[]> => {
  const response = await fetch(`http://localhost:8000/api/subjects/?level_id=${levelId}`);
  if (!response.ok) throw new Error('Failed to load subjects by level');
  return response.json();
};

export const getPeriods = async (): Promise<{ id: number; period: string }[]> => {
  const response = await fetch('http://localhost:8000/api/periods/');
  if (!response.ok) throw new Error('Failed to load periods');
  return response.json();
};

export const getGradesByPeriodSubject = async (levelId: number, subjectId: number, periodId: number): Promise<{ student_id: number; student_name: string; score: number }[]> => {
  const response = await fetch(`http://localhost:8000/api/grade_sheets/by_period_subject/?level_id=${levelId}&subject_id=${subjectId}&period_id=${periodId}`);
  if (!response.ok) throw new Error('Failed to load grades');
  return response.json();
};

export const postGrades = async (data: {
  level: number;
  subject_id: number;
  period_id: number;
  grades: { student_id: number; score: number }[];
}) => {
  const response = await fetch('http://localhost:8000/api/grade_sheets/input/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  // Log the raw response for debugging
  const contentType = response.headers.get('content-type');
  console.log('Response status:', response.status);
  console.log('Response content-type:', contentType);

  if (!response.ok) {
    const text = await response.text();
    console.error('Response body (non-JSON):', text);
    throw new Error(`Failed to post grades: ${response.status} - ${text}`);
  }

  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('Response body (non-JSON):', text);
    throw new Error('Response is not JSON');
  }

  return response.json();
};

// api.ts
export const getGradesByLevel = async (levelId: number): Promise<{
  student_id: number;
  student_name: string;
  subjects: {
    subject_id: number;
    subject_name: string;
    "1st": number | null;
    "2nd": number | null;
    "3rd": number | null;
    "1exam": number | null;
    "4th": number | null;
    "5th": number | null;
    "6th": number | null;
    "2exam": number | null;
    sem1_avg: number | null;
    sem2_avg: number | null;
    final_avg: number | null;
  }[];
}[]> => {
  const response = await fetch(`http://localhost:8000/api/grade_sheets/by_level/?level_id=${levelId}`);
  if (!response.ok) throw new Error('Failed to load grades by level');
  return response.json();
};
// Updated function to add a student
export const addStudent = async (data: {
  firstName: string;
  lastName: string;
  gender: 'M' | 'F' | 'O';
  dob: string; // Format: YYYY-MM-DD
  level: number; // Changed from level_id to level to match backend expectation
}): Promise<{
  level: number; id: number; firstName: string; lastName: string; gender: string; dob: string;
}> => {
  const response = await fetch('http://localhost:8000/api/students/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to add student');
  }
  return response.json();
};
// New function to enroll a student
