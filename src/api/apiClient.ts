// api/index.ts
import { useApi } from './useApi';
import type {
  AcademicYear,
  GradeSheet,
  GradeSheetEntry,
  Level,
  PaginatedResponse,
  PdfResponse,
  Period,
  Student,
  StudentEnrollmentData,
  GradeResponse,
  Subject,
  PostGradesData,
  PassFailedStatus,
} from '../types';

// Helper function to handle paginated or array responses
export const extractData = <T>(response: any): T[] => {
  if (Array.isArray(response)) return response;
  if (response && typeof response === 'object' && Array.isArray(response.results)) {
    return response.results;
  }
  console.error('Invalid response format:', JSON.stringify(response, null, 2));
  throw new Error(`Expected array or paginated results, got ${typeof response}`);
};

// API client
export const apiClient = {
  gradeSheets: {
    getGradeSheetsByLevel: async (levelId: number, academicYear: string): Promise<GradeSheet[]> => {
      const { get } = useApi();
      try {
        const response = await get<PaginatedResponse<GradeSheet> | GradeSheet[] | { error: string }>(
          'grade_sheets/by_level/',
          { params: { level_id: levelId, academic_year: academicYear } }
        );
        console.log('Raw GradeSheets API Response:', JSON.stringify(response.data, null, 2));
        if ('error' in response.data) {
          console.warn('API returned error:', response.data.error);
          return [];
        }
        return extractData<GradeSheet>(response.data);
      } catch (error: any) {
        console.error('Fetch GradeSheets Error:', JSON.stringify({
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        }, null, 2));
        return [];
      }
    },



    
  },

  academicYears: {
    getAcademicYears: async (): Promise<AcademicYear[]> => {
      const { get } = useApi();
      try {
        const response = await get<PaginatedResponse<AcademicYear>>('academic_years/');
        console.log('Raw Academic Years API Response:', JSON.stringify(response.data, null, 2));
        return extractData<AcademicYear>(response.data);
      } catch (error: any) {
        console.error('Fetch Academic Years Error:', JSON.stringify({
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        }, null, 2));
        throw error;
      }
    },

    createAcademicYear: async (data: { name: string; start_date: string; end_date: string }): Promise<AcademicYear> => {
      const { post } = useApi();
      try {
        const response = await post<AcademicYear>('academic_years/', data, {
          headers: { 'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '' },
          });
        console.log('Create Academic Year Response:', JSON.stringify(response.data, null, 2));
        return response.data;
      } catch (error: any) {
        console.error('Create Academic Year Error:', JSON.stringify({
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        }, null, 2));
        throw error;
      }
    },

    updateAcademicYear: async (id: number, data: { name: string; start_date: string; end_date: string }): Promise<AcademicYear> => {
      const { put } = useApi();
      try {
        const response = await put<AcademicYear>(`academic_years/${id}/`, data, {
          headers: { 'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '' },
        });
        console.log('Update Academic Year Response:', JSON.stringify(response.data, null, 2));
        return response.data;
      } catch (error: any) {
        console.error('Update Academic Year Error:', JSON.stringify({
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        }, null, 2));
        throw error;
      }
    },
    
    delAcademicYear: async (id: number): Promise<void> => {
      const { del } = useApi();
      try {
        await del(`academicYears/${id}/`, {
          headers: { 'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '' },
        });
        console.log(`Deleted Academic year ID: ${id}`);
      } catch (error: any) {
        console.error('Delete Academic Error:', JSON.stringify({
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        }, null, 2));
        throw error;
      }
    },

  },
    students: {
    getStudentsByLevel: async (levelId: number, academicYear: string): Promise<Student[]> => {
      const { get } = useApi();
      try {
        const response = await get<PaginatedResponse<Student>>('students/', {
          params: { level_id: levelId, academic_year: academicYear },
        });
        console.log('Raw Students API Response:', JSON.stringify(response.data, null, 2));
        return extractData<Student>(response.data);
      } catch (error: any) {
        console.error('Fetch Students Error:', JSON.stringify({
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        }, null, 2));
        throw error;
      }
    },
    
  
    addStudentAndEnroll: async (data: StudentEnrollmentData): Promise<Student> => {
      const { post } = useApi();
      try {
        const studentResponse = await post<Student>('students/', {
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          dob: data.dob,
        });
        const newStudent = studentResponse.data;
        console.log('Add Student Response:', JSON.stringify(newStudent, null, 2));

        const enrollmentResponse = await post('enrollments/', {
          student: newStudent.id,
          level: data.level_id,
          academic_year: data.academic_year_id,
          date_enrolled: data.date_enrolled,
          enrollment_status: 'ENROLLED',
        });
        console.log('Add Enrollment Response:', JSON.stringify(enrollmentResponse.data, null, 2));
        return newStudent;
      } catch (error: any) {
        console.error('Add Student and Enroll Error:', JSON.stringify({
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        }, null, 2));
        throw error;
      }
    },

    updateStudent: async (id: number, data: {
      firstName: string;
      lastName: string;
      gender: 'M' | 'F' | 'O';
      dob: string;
      level: number;
      academic_year: number;
    }): Promise<Student> => {
      const { put } = useApi();
      try {
        const response = await put<Student>(`students/${id}/`, data);
        console.log('Update Student Response:', JSON.stringify(response.data, null, 2));
        return response.data;
      } catch (error: any) {
        console.error('Update Student Error:', JSON.stringify({
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        }, null, 2));
        throw error;
      }
    },

    deleteStudent: async (id: number): Promise<void> => {
      const { del } = useApi();
      try {
        await del(`students/${id}/`);
        console.log(`Deleted Student ID: ${id}`);
      } catch (error: any) {
        console.error('Delete Student Error:', JSON.stringify({
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        }, null, 2));
        throw error;
      }
    },
  },

  periods: {
    getPeriods: async (): Promise<Period[]> => {
      const { get } = useApi();
      try {
        const response = await get<PaginatedResponse<Period[]>>('periods/');
        console.log('Raw Periods API Response:', JSON.stringify(response.data, null, 2));
        return extractData<Period>(response.data);
      } catch (error: any) {
        console.error('Fetch Periods Error:', JSON.stringify({
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        }, null, 2));
        return [];
      }
    },

    createPeriod: async (data: { period: string }): Promise<Period> => {
      const { post } = useApi();
      try {
        const response = await post<Period>('periods/', data, {
          headers: { 'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '' },
        });
        console.log('Create Period Response:', JSON.stringify(response.data, null, 2));
        return response.data;
      } catch (error: any) {
        console.error('Create Period Error:', JSON.stringify({
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        }, null, 2));
        throw error;
      }
    },

    updatePeriod: async (id: number, data: { period: string }): Promise<Period> => {
      const { put } = useApi();
      try {
        const response = await put<Period>(`periods/${id}/`, data, {
          headers: { 'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '' },
        });
        console.log('Update Period Response:', JSON.stringify(response.data, null, 2));
        return response.data;
      } catch (error: any) {
        console.error('Update Period Error:', JSON.stringify({
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        }, null, 2));
        throw error;
      }
    },

    deletePeriod: async (id: number): Promise<void> => {
      const { del } = useApi();
      try {
        await del(`periods/${id}/`, {
          headers: { 'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '' },
        });
        console.log(`Deleted Period ID: ${id}`);
      } catch (error: any) {
        console.error('Delete Period Error:', JSON.stringify({
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        }, null, 2));
        throw error;
      }
    },
  },

  pdfs:{
    
  generatePeriodicPDF: async (
    levelId: number,
    academicYearId: number,
    studentId?: number
  ): Promise<PdfResponse> => {
    const {get} = useApi();
    try {
      const params: { level_id: number; academic_year_id: number; student_id?: number } = {
        level_id: levelId,
        academic_year_id: academicYearId,
      };
      if (studentId !== undefined) {
        params.student_id = studentId;
      }
      const response = await get<PaginatedResponse<PdfResponse>>(`grade_sheets_pdf/gradesheet/pdf/generate/`, {
        params
      });
      console.log('Generate Periodic PDF Response:', JSON.stringify(response.data, null, 2));
      if (!response.data.view_url) {
        throw new Error('No view_url in PDF response');
      }
      return response.data;
    } catch (error: any) {
      console.error('Generate Periodic PDF Error:', JSON.stringify({
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      }, null, 2));
      throw error;
    }
  },

  
  generateYearlyPDF: async (
    levelId: number,
    academicYearId: number,
    status?: 'pass' | 'fail' | 'conditional',
    studentId?: number
  ): Promise<PdfResponse> => {
    const {get} = useApi();
    try {
      const params: { level_id: number; academic_year_id: number; student_id?: number; pass_template?: boolean; conditional?: boolean } = {
        level_id: levelId,
        academic_year_id: academicYearId,
      };
      if (studentId !== undefined) {
        params.student_id = studentId;
      }
      if (status && !studentId) {
        params.pass_template = status === 'pass';
        params.conditional = status === 'conditional';
      }
      const response = await get <PaginatedResponse<PdfResponse>>(`grade_sheets_pdf/yearly/pdf/generate/`,
        {params}
      )
      console.log('Generate Yearly PDF Response:', JSON.stringify(response.data, null, 2));
      if (!response.data.view_url) {
        throw new Error('No view_url in PDF response');
      }
      return response.data;
    } catch (error: any) {
      console.error('Generate Yearly PDF Error:', JSON.stringify({
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      }, null, 2));
      throw error;
    }
  },

  },


  subjects:{
    getSubjects:async (subject?:string, id?:number, level_id?:number
): Promise<Subject[]> => {
      const {get} = useApi();
try {
  const response = await get <PaginatedResponse<Subject[]>>(`subjects/`, {
  params:{level_id:level_id, subject:subject, id:id}
  });
  console.log('Raw Subjects API Response:', JSON.stringify(response.data, null, 2));
  return extractData<Subject>(response.data);

} catch (error: any) {
  console.error('Fetch Subjects Error:', JSON.stringify({
    message: error.message,
    response: error.response?.data,
    status: error.response?.status,
  }, null, 2));
  return [];
}
},
getSubjectsByLevel: async (level_id: number): Promise<Subject[]> => {
  const {get} = useApi();
try {
  const response = await get <PaginatedResponse <Subject[]>>(`subjects/`, {
    params: { level_id: level_id },
  });
  console.log('Raw Subjects by Level API Response:', JSON.stringify(response.data, null, 2));
  return extractData<Subject>(response.data);
} catch (error: any) {
  console.error('Fetch Subjects by Level Error:', JSON.stringify({
    message: error.message,
    response: error.response?.data,
    status: error.response?.status,
  }, null, 2));
  throw error;
}
},
createSubject: async (data: { subject: string; level: number }): Promise<Subject> => {
    const { post } = useApi();
    try {
      const response = await post<Subject>('subjects/', data, {
        headers: { 'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '' },
      });
      console.log('Create Subject Response:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error: any) {
      console.error('Create Subject Error:', JSON.stringify({
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      }, null, 2));
      throw error;
    }
  },
  updateSubject: async (id: number, data: { subject: string; level: number }): Promise<Subject> => {
    const { put } = useApi();
    try {
      const response = await put(`subjects/${id}/`, data, {
        headers: { 'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '' },
      });
      console.log('Update Subject Response:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error: any) {
      console.error('Update Subject Error:', JSON.stringify({
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      }, null, 2));
      throw error;
    }
  },

deleteSubject: async (id: number): Promise<void> => {
  const {del} = useApi();
  try {
    await del(`subjects/${id}/`, {
      headers: { 'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '' },
    });
    console.log(`Deleted Subject ID: ${id}`);
  } catch (error: any) {
    console.error('Delete Subject Error:', JSON.stringify({
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    }, null, 2));
    throw error;
  }
}

  },

  grades:{
    postGrades: async (data: PostGradesData): Promise<GradeResponse> => {
      const {post} = useApi();
    try {
      
      const response = await post <GradeResponse>(`grade_sheets/input/`, data, {
        headers: { 'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '' },
      })
      console.log('Post Grades Response:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error: any) {
      console.error('Post Grades Error:', JSON.stringify({
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      }, null, 2));
      throw error;
    }
  },
  getGradesByPeriodSubject: async (
    levelId: number,
    subjectId: number,
    periodId: number,
    academicYear: number
  ): Promise<GradeSheetEntry[]> => {
    const { get } = useApi();
    try {
      const response = await get<GradeSheetEntry[]>(
        'grade_sheets/by_period_subject/',
        { params: { level_id: levelId, subject_id: subjectId, period_id: periodId, academic_year: academicYear } }
      );
      console.log('Raw Grades By Period Subject Response:', JSON.stringify(response.data, null, 2));
      return response.data || [];
    } catch (error: any) {
      console.error('Fetch Grades Error:', JSON.stringify({
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      }, null, 2));
      return [];
    }
  },

  getGradesByLevel: async (level_id: number): Promise<any> => {
    throw new Error('Function not implemented.');
  },
  },

  pass_failed_statues: {
    getStatusesByLevelAndYear: async (levelId: number, academicYear: string
    ): Promise<PassFailedStatus[]> => {
        const {get} = useApi();
      try {
        const response = await get<PaginatedResponse<PassFailedStatus>> (`pass_failed_statuses/`, {
          params: { level_id: levelId, academic_year: academicYear },
        });
        console.log('Statuses response:', response.data);
        return extractData<PassFailedStatus>(response.data);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Get statuses error:', error);
        throw new Error(`Failed to fetch statuses: ${message}`);
      }
    },

validateStatus: async (statusId: number, status: 'PASS' | 'FAIL' | 'CONDITIONAL',
  validatedBy: string
): Promise<PassFailedStatus> => {
  console.log('Validating status for ID:', statusId, 'with data:', { status, validated_by: validatedBy });
  const {post} = useApi();
  try {
    const response = await post<PassFailedStatus>(`pass_failed_statuses/${statusId}/validate/`, {
      status,
      validated_by: validatedBy, 
      headers: { 'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '' },
    });
    console.log('Validate status response:', response.data);
    return response.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Validate status error:', error);
    throw new Error(`Failed to validate status: ${message}`);
  }
},
  
promoteStudent: async (statusId: number, levelId: number, promotedBy: string
): Promise<{ message: string; new_level_id: number }> => {
  console.log('Promoting student:', { statusId, levelId, promotedBy });
  const {post} = useApi();
  try {
    const response = await post<{message:string; new_level_id:number}>(`pass_failed_statuses/${statusId}/promote/`,
      { level_id: levelId, role: 'admin' }, {
        headers: { 'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '' },
      }
    );
    console.log('Promote student response:', response.data);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.error || (error instanceof Error ? error.message : 'Unknown error');
    console.error('Promote student error:', error);
    throw new Error(`Failed to promote student: ${message}`);
  }

  }
},

  levels: {
    getLevels: async (): Promise<Level[]> => {
      const { get } = useApi();
      try {
        const response = await get<PaginatedResponse<Level>>('levels/');
        console.log('Raw Levels API Response:', JSON.stringify(response.data, null, 2));
        return extractData<Level>(response.data);
      } catch (error: any) {
        console.error('Fetch Levels Error:', JSON.stringify({
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        }, null, 2));
        throw error;
      }
    },
  
    createLevel: async (data: { name: string }): Promise<Level> => {
      const { post } = useApi();
      try {
        const response = await post<Level>('levels/', data, {
          headers: { 'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '' },
        });
        console.log('Create Level Response:', JSON.stringify(response.data, null, 2));
        return response.data;
      } catch (error: any) {
        console.error('Create Level Error:', JSON.stringify({
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        }, null, 2));
        throw error;
      }
    },

    updateLevel: async (id: number, data: { name: string }): Promise<Level> => {
      const { put } = useApi();
      try {
        const response = await put<Level>(`levels/${id}/`, data, {
          headers: { 'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '' },
        });
        console.log('Update Level Response:', JSON.stringify(response.data, null, 2));
        return response.data;
      } catch (error: any) {
        console.error('Update Level Error:', JSON.stringify({
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        }, null, 2));
        throw error;
      }
    },

    deleteLevel: async (id: number): Promise<void> => {
      const { del } = useApi();
      try {
        await del(`levels/${id}/`, {
          headers: { 'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '' },
        });
        console.log(`Deleted Level ID: ${id}`);
      } catch (error: any) {
        console.error('Delete Level Error:', JSON.stringify({
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        }, null, 2));
        throw error;
      }
    },
  }
}
