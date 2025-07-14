import { Routes, Route } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import DashboardPage from '../pages/DashboardPage';
import StudentsPage from '../pages/StudentsPage';
import GradeSheetsPage from '../pages/GradeSheetsPage';
import GradeEntryPage from '../pages/GradeEntryPage';
import GradeViewPage from '../pages/GradeViewPage';
import StudentManagementPage from '../pages/StudentManagementPage';
import ReportCard from '../pages/ReportCard';
import AdminManagement from '../pages/AdminManagement';
import { LoginPage } from '../pages/LoginPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<DashboardShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="gradesheets" element={<GradeSheetsPage />} />
        <Route path="gradesheets/:levelId" element={<GradeViewPage />} />
        <Route path="gradeentry" element={<GradeEntryPage />} />
        <Route path="studentmanagement" element={<StudentManagementPage />} />
        <Route path="reportcard" element={<ReportCard />} />
        <Route path="adminmanagement" element={ <AdminManagement />}/>
      </Route>
    </Routes>
  );
};

export default AppRoutes;