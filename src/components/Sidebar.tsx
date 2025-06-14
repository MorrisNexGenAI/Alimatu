// C:\Users\USER\Desktop\GradeSheet\SchoolGradesSystem\src\components\layout\Sidebar.tsx
import { NavLink } from 'react-router-dom';
import './sidebar.css'; // Keep the Sidebar-specific styles
import BomiTheme, { bomiStyles } from '../templates/Bomi junior High/bomi'; // Import Bomi theme
import { 
  HomeIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  PencilIcon, 
  UserGroupIcon, 
  Cog6ToothIcon
} from  '@heroicons/react/24/outline';// Import relevant icons

const Sidebar: React.FC = () => {
  return (
    <BomiTheme>
      <aside className="w-64 p-4">
        <nav>
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? 'block p-2 rounded' : 'block p-2 hover:rounded'
                }
                style={{ color: '#008000' }} // Green color from Bomi theme
              >
                {({ isActive }) => (
                  <>
                    <HomeIcon className="h-0.5 w-0.5 inline-block mr-2" /> {/* Reduced size */}
                    {isActive ? <span className="font-bold">Dashboard</span> : 'Dashboard'}
                  </>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/students"
                className={({ isActive }) =>
                  isActive ? 'block p-2 rounded' : 'block p-2 hover:rounded'
                }
                style={{ color: '#008000' }}
              >
                {({ isActive }) => (
                  <>
                    <UsersIcon className="h-1 w-1 inline-block mr-2" /> {/* Reduced size */}
                    {isActive ? <span className="font-bold">Students</span> : 'Students'}
                  </>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/gradesheets"
                className={({ isActive }) =>
                  isActive ? 'block p-2 rounded' : 'block p-2 hover:rounded'
                }
                style={{ color: '#008000' }}
              >
                {({ isActive }) => (
                  <>
                    <DocumentTextIcon className="h-4 w-4 inline-block mr-2" /> {/* Reduced size */}
                    {isActive ? <span className="font-bold">Grade Sheets</span> : 'Grade Sheets'}
                  </>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/gradeentry"
                className={({ isActive }) =>
                  isActive ? 'block p-2 rounded' : 'block p-2 hover:rounded'
                }
                style={{ color: '#008000' }}
              >
                {({ isActive }) => (
                  <>
                    <PencilIcon className="h-2 w-2 inline-block mr-2" /> {/* Reduced size */}
                    {isActive ? <span className="font-bold">Grade Entry</span> : 'Grade Entry'}
                  </>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/studentmanagement"
                className={({ isActive }) =>
                  isActive ? 'block p-2 rounded' : 'block p-2 hover:rounded'
                }
                style={{ color: '#008000' }}
              >
                {({ isActive }) => (
                  <>
                    <UserGroupIcon className="h-4 w-4 inline-block mr-2" /> {/* Reduced size */}
                    {isActive ? <span className="font-bold">Student Management</span> : 'Student Management'}
                  </>
                )}
              </NavLink>
            </li>
            <li>
            <NavLink
              to="/reportcard"
              className={({ isActive }) =>
                isActive ? 'block p-2 rounded' : 'block p-2 hover:rounded'
              }
              style={{ color: '#008000' }}
            >
              {({ isActive }) => (
                <>
                  <HomeIcon className="h-4 w-4 inline-block mr-2" /> {/* Reduced size */}
                  {isActive ? <span className="font-bold">ReportCard</span> : 'report card'}
                </>
              )}
            </NavLink>
          </li>
          </ul>
        </nav>
      </aside>
    </BomiTheme>
  );
};

export default Sidebar;