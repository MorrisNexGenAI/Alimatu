// src/routes/AppRoutes.tsx
import { Routes, Route } from 'react-router-dom';
import DashboardShell from '../components/layout/DashboardShell';
import Dashboard from '../features/dashboard/Dashboard';
import StudentsPage from '../features/students/StudentsPage';
import EnrollmentsPage from '../features/enrollments/EnrollmentsPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardShell />}>
        <Route index element={<Dashboard />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="enrollments" element={<EnrollmentsPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
