// src/components/layout/DashboardShell.tsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const DashboardShell = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header/>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet /> 
        </main>
      </div>
<Footer/>
   
    </div>
  )
}

export default DashboardShell;
