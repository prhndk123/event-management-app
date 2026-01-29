import { Outlet } from 'react-router';
import { Navbar } from './navbar';
import { Footer } from './footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

    </div>
  );
}
