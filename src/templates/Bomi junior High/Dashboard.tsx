// C:\Users\USER\Desktop\GradeSheet\SchoolGradesSystem\src\templates\Bomi junior High\DashboardLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import BomiHeader from './components/layout/BomiHeader';
import BomiFooter from './components/layout/BomiFooter';
import Sidebar from '../../components/Sidebar';
import BomiTheme from './bomi';

const BomiDashboardLayout: React.FC = () => {
  return (
    <BomiTheme>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <BomiHeader />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-4">
            <Outlet />
          </main>
        </div>
        <BomiFooter />
      </div>
    </BomiTheme>
  );
};

export default BomiDashboardLayout;