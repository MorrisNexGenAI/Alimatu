// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import studentReducer from './features/students/studentSlice';

export const store = configureStore({
  reducer: {
    students: studentReducer,
  },
});

// TypeScript types for use throughout your app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
