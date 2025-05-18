// src/components/layout/DashboardShell.tsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardShell = () => {
  return (
    <div className="flex flex-col h-screen">
      <header className="h-16 bg-white shadow flex items-center px-6">
        <h1 className="text-xl font-bold">School Management System</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-gray-100 p-6">
          <Outlet /> {/* This is where students/enrollments/dashboard will render */}
        </main>
      </div>

      <footer className="h-12 bg-white shadow flex items-center justify-center">
        <p className="text-gray-600 text-sm">© 2025 Your School Name</p>
      </footer>
    </div>
  );
};

export default DashboardShell;
