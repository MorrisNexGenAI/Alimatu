import React, { useState } from 'react';
import { SubjectPage } from './forms/Subject';
import { LevelPage } from './forms/Level';

import  BomiTheme from '../../templates/Bomi junior High/bomi';



const sections = [
  { name: 'Subjects', component: <SubjectPage /> },
  { name: 'Levels', component: <LevelPage /> },

];

export const AdminPage: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (sectionName: string) => {
    setOpenSection(openSection === sectionName ? null : sectionName);
  };

  return (
    <BomiTheme>
      <div className="container">
        <div className="bomi-header">
          <div className="bomi-logo">
            <img src="/logo.png" alt="Bomi Junior High Logo" />
          </div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.name} className="card">
              <div
                className="flex justify-between items-center p-4 cursor-pointer"
                onClick={() => toggleSection(section.name)}
              >
                <h2 className="text-xl font-semibold">{section.name}</h2>
                <span>{openSection === section.name ? '−' : '+'}</span>
              </div>
              {openSection === section.name && (
                <div className="p-4">{section.component}</div>
              )}
            </div>
          ))}
        </div>
        <div className="bomi-footer">
          <p>&copy; 2025 Bomi Junior High. All rights reserved.</p>
        </div>
      </div>
    </BomiTheme>
  );
};