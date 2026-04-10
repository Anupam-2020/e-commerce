import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export const AppLayout = () => {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="container page-shell">
        <Outlet />
      </main>
    </div>
  );
};
