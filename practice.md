
  generateYearlyPDF: async (
    levelId: number,
    academicYearId: number,
    status?: 'pass' | 'fail' | 'conditional',
    studentId?: number
  ): Promise<PdfResponse> => {
    const {get} = useApi();
    try {
      const csrfToken = await getCsrfToken();
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
      const response = axios get <PaginatedResponse<PdfResponse>>(
        `grade_sheets_pdf/yearly/pdf/generate/`,
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
};