import { Routes, Route } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import DashboardPage from '../pages/DashboardPage';
import StudentsPage from '../pages/StudentsPage';
import GradeSheetsPage from '../pages/GradeSheetsPage';
import GradeEntryPage from '../pages/GradeEntryPage';
import GradeViewPage from '../pages/GradeViewPage';
import StudentManagementPage from '../pages/StudentManagementPage';
import GradeSheetTest from '../pages/GradeSheetTest';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="gradesheets" element={<GradeSheetsPage />} />
        <Route path="gradesheets/:levelId" element={<GradeViewPage />} />
        <Route path="gradeentry" element={<GradeEntryPage />} />
        <Route path="studentmanagement" element={<StudentManagementPage />} />
        <Route path="gradesheettest" element={<GradeSheetTest />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;