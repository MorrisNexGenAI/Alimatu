// src/components/layout/Sidebar.tsx
import { NavLink } from 'react-router-dom';

const menuItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/students', label: 'Students' },
  { to: '/enrollments', label: 'Enrollments' },
];

const Sidebar = () => (
  <nav className="w-56 bg-gray-800 text-white min-h-screen p-4">
    <h2 className="text-xl font-semibold mb-6">Menu</h2>
    <ul>
      {menuItems.map(({ to, label }) => (
        <li key={to} className="mb-2">
          <NavLink
            to={to}
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${
                isActive ? 'bg-blue-600' : 'hover:bg-gray-700'
              }`
            }
          >
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
);

export default Sidebar;
