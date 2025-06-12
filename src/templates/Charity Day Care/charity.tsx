// C:\Users\USER\Desktop\GradeSheet\SchoolGradesSystem\src\templates\Bomi junior High\bomi.tsx
import React from 'react';
import './components/layout/charity.css'; // Import the existing bomi.css


const CharityTheme: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="charity-theme">
      {children}
    </div>
  );
};

export const charityStyles = {
  primaryColor: 'blue', // blue
  secondaryColor: 'purple', // purple
  textColor: ' rgb(76, 76, 121)',
  backgroundColor: 'black',
  linkColor: 'blue', // blue for links
  linkHover: {
    textDecoration: 'underline',
  },
};

export default CharityTheme;