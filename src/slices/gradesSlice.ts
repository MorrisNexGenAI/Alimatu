import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addGrade, getGradesheets } from '../api/grades';
import type { GradeInput, Gradesheet } from '../types';

interface GradesState {
  gradesheets: Gradesheet[];
  loading: boolean;
  error: string | null;
}

const initialState: GradesState = {
  gradesheets: [],
  loading: false,
  error: null,
};

export const fetchGradesheetsByStudent = createAsyncThunk(
  'grades/fetchGradesheetsByStudent',
  async (studentId: string) => {
    return await getGradesheets(studentId);
  },
);

export const addGrades = createAsyncThunk('grades/addGrades', async (grade: GradeInput) => {
  return await addGrade(grade);
});

const gradesSlice = createSlice({
  name: 'grades',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGradesheetsByStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGradesheetsByStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.gradesheets = action.payload;
      })
      .addCase(fetchGradesheetsByStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch gradesheets';
      })
      .addCase(addGrades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addGrades.fulfilled, (state) => {
        state.loading = false;
        // Optionally update gradesheets if backend returns updated data
      })
      .addCase(addGrades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add grade';
      });
  },
});

export default gradesSlice.reducer;