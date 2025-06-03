// C:\Users\USER\Desktop\GradeSheet\SchoolGradesSystem\src\templates\Bomi junior High\components\layout\BomiHeader.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import './bomi.css'; 

const BomiHeader: React.FC = () => {
  const location = useLocation();
  const pageTitle = location.pathname.split('/').pop() || 'Dashboard';
  const formattedTitle = pageTitle
    .split(/(?=[A-Z])/)
    .join(' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <header className="bomi-header">
      <div className="bomi-logo">
        <img src="/static/schools/bomi-junior-high/images/bomi-logo.png" alt="Bomi Logo" className="w-full h-full rounded-full" />
      </div>
      <div>
        <h1 className="text-lg font-bold">BOMI JUNIOR HIGH SCHOOL</h1>
      </div>
      <div className="flex-1 text-center">
        <h2 className="text-xl">{formattedTitle}</h2>
      </div>
    </header>
  );
};

export default BomiHeader;