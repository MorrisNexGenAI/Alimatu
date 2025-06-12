// C:\Users\USER\Desktop\GradeSheet\SchoolGradesSystem\src\templates\Bomi junior High\components\layout\BomiHeader.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import './charity.css'; 

const CharityHeader: React.FC = () => {
  const location = useLocation();
  const pageTitle = location.pathname.split('/').pop() || 'Dashboard';
  const formattedTitle = pageTitle
    .split(/(?=[A-Z])/)
    .join(' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <header className="bomi-header">
      <div className="bomi-logo">
        <img src="/static/schools/charity-img/images/charity-logo.png" alt="Charity logo" className="w-full h-full rounded-full" />
      </div>
      <div>
        <h1 className="text-lg font-bold">CHARITY CHRISTIAN DAYCARE SCHOOL</h1>
      </div>
      <div className="flex-1 text-center">
        <h2 className="text-xl">{formattedTitle}</h2>
      </div>
    </header>
  );
};

export default CharityHeader;