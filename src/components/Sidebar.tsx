// src/components/layout/Sidebar.tsx
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return(
    <aside className="w-64 bg-gray-800 text-white p-4">
      <nav>
        <ul className="space-y-2">
          <li>
            <NavLink to="/" 
            className={({isActive})=>
            isActive ? 'block p-2 bg-gray-600 rounded': 'block p-2 hover: bg-gray-600 rounded'}
            >Dashboard</NavLink>
</li>
<li>
            <NavLink to="/students" 
            className={({isActive})=>
            isActive ? 'block p-2 bg-gray-600 rounded': 'block p-2 hover: bg-gray-600 rounded'}
            >Students</NavLink>
</li>
<li>
            <NavLink to="/gradesheets" 
            className={({isActive})=>
            isActive ? 'block p-2 bg-gray-600 rounded': 'block p-2 hover: bg-gray-600 rounded'}
            >GradeSheets</NavLink>
</li>


<li>
            <NavLink to="/gradeentry" 
            className={({isActive})=>
            isActive ? 'block p-2 bg-gray-600 rounded': 'block p-2 hover: bg-gray-600 rounded'}
            >GradeEntry</NavLink>
</li>
<li>
            <NavLink to="/studentmanagement" 
            className={({isActive})=>
            isActive ? 'block p-2 bg-gray-600 rounded': 'block p-2 hover: bg-gray-600 rounded'}
            >Student Management Page</NavLink>
</li>
        </ul>
        </nav>
      </aside>
  )
}
export default Sidebar;
  