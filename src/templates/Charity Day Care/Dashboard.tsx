// C:\Users\USER\Desktop\GradeSheet\SchoolGradesSystem\src\templates\Bomi junior High\DashboardLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import CharityHeader from './components/layout/CharityHeader';
import CharityFooter from './components/layout/CharityFooter';
import Sidebar from '../../components/Sidebar';
import CharityTheme from './charity';

const CharityDashboardLayout: React.FC = () => {
  return (
    <CharityTheme>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <CharityHeader />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-4">
            <Outlet />
          </main>
        </div>
        <CharityFooter />
      </div>
    </CharityTheme>
  );
};

export default CharityDashboardLayout;