// C:\Users\USER\Desktop\GradeSheet\SchoolGradesSystem\src\pages\DashboardPage.tsx
import React from 'react';
import BomiTheme from '../templates/Bomi junior High/bomi';


const DashboardPage: React.FC = () => {
  return (
    <BomiTheme>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="bomi-card p-4">
          <h2 className="text-lg font-bold">Total Students</h2>
          <p className="text-2xl">50</p>
        </div>
        <div className="bomi-card p-4">
          <h2 className="text-lg font-bold">Recent Grades</h2>
          <p className="text-2xl">10 added</p>
        </div>
        <div className="bomi-card p-4">
          <h2 className="text-lg font-bold">Quick Links</h2>
          <ul className="list-disc pl-5">
            <li><a href="/students" className="text-green-600 hover:underline">Students</a></li>
            <li><a href="/grade-sheets" className="text-green-600 hover:underline">Grade Sheets</a></li>
          </ul>
        </div>
      </div>
   
    </BomiTheme>
  );
};

export default DashboardPage;