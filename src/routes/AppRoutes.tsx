// src/routes/AppRoutes.tsx
import { Routes, Route } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import DashboardPage from '../pages/DashboardPage';
import StudentsPage from '../pages/StudentsPage';
import GradeSheetsPage from '../pages/GradeSheetsPage';
import GradeEntryPage from '../pages/GradeEntryPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="gradesheets" element={<GradeSheetsPage />} />
        <Route path="gradeentry" element={<GradeEntryPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;