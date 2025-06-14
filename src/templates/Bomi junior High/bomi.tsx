import React from 'react';
import './components/layout/bomi.css';

const BomiTheme: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="bomi-theme">{children}</div>;
};

export const bomiStyles = {
  primaryColor: '#FFFFFF',
  secondaryColor: '#008000',
  textColor: '#333333',
  backgroundColor: '#F5F5F5',
  linkColor: '#008000',
  linkHover: {
    textDecoration: 'underline',
  },
};

export default BomiTheme;