import React from 'react';
import { useDashboard } from '../../../hooks/useDashBoard';
import BomiTheme from '../bomi';
import '../styles/b_dashboard.css';

const BDashboardPage: React.FC = () => {
  const { metrics, loading, error } = useDashboard();

  return (
    <BomiTheme>
      <div className="b-dashboard-page p-4">
        <h1 className="b-dashboard-heading">Dashboard</h1>
        {loading && <p className="b-dashboard-message">Loading metrics...</p>}
        {error && <p className="b-error-message">{error}</p>}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="b-dashboard-card">
            <h2 className="b-card-title">Total Students</h2>
            <p className="b-card-value">{metrics.totalStudents}</p>
          </div>
          <div className="b-dashboard-card">
            <h2 className="b-card-title">Recent Grades</h2>
            <p className="b-card-value">{metrics.recentGrades} added</p>
          </div>
          <div className="b-dashboard-card">
            <h2 className="b-card-title">Quick Links</h2>
            <ul className="b-quick-links">
              <li>
                <a href="/students" className="b-link">
                  Students
                </a>
              </li>
              <li>
                <a href="/grade-sheets" className="b-link">
                  Grade Sheets
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </BomiTheme>
  );
};

export default BDashboardPage;