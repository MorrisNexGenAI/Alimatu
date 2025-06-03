// C:\Users\USER\Desktop\GradeSheet\SchoolGradesSystem\src\templates\Bomi junior High\bomi.tsx
import React from 'react';
import './components/layout/bomi.css'; // Import the existing bomi.css


const BomiTheme: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bomi-theme">
      {children}
    </div>
  );
};

export const bomiStyles = {
  primaryColor: '#FFFFFF', // White
  secondaryColor: '#008000', // Green
  textColor: '#333333',
  backgroundColor: '#F5F5F5',
  linkColor: '#008000', // Green for links
  linkHover: {
    textDecoration: 'underline',
  },
};

export default BomiTheme;