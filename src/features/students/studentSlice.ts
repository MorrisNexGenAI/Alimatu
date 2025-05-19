// features/students/studentSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface Student {
  id: number;
  first_name:string;
  last_name:string;
  dob:string;
  gender: string;
  // Add other fields as needed
}

interface StudentsState {
  students: Student[];
  loading: boolean;
  error: string | null;
}

const initialState: StudentsState = {
  students: [],
  loading: false,
  error: null,
};

// ✅ Async thunks using correct API URL
export const fetchStudents = createAsyncThunk('students/fetch', async () => {
  const res = await axios.get(`${API_URL}/students/`);
  return res.data;
});


export const addStudent = createAsyncThunk(
  'students/add',
  async (student: Omit<Student, 'id'>) => {
console.log("Submitting student:", student); // or payload

    const res = await axios.post(`${API_URL}/students/`, student);
    return res.data;
  }
);

export const updateStudent = createAsyncThunk(
  'students/update',
  async (student: Student) => {
    const res = await axios.put(`${API_URL}/students/${student.id}/`, student);
    return res.data;
  }
);

export const deleteStudent = createAsyncThunk(
  'students/delete',
  async (id: number) => {
    await axios.delete(`${API_URL}/students/${id}/`);
    return id;
  }
);

const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudents.fulfilled, (state, action: PayloadAction<Student[]>) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch students';
      })
      .addCase(addStudent.fulfilled, (state, action: PayloadAction<Student>) => {
        state.students.push(action.payload);
      })
      .addCase(updateStudent.fulfilled, (state, action: PayloadAction<Student>) => {
        const index = state.students.findIndex(s => s.id === action.payload.id);
        if (index !== -1) state.students[index] = action.payload;
      })
      .addCase(deleteStudent.fulfilled, (state, action: PayloadAction<number>) => {
        state.students = state.students.filter(s => s.id !== action.payload);
      });
  },
});

export default studentSlice.reducer;
