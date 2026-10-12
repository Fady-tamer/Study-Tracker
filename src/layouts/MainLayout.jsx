import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  return (
    <div className="relative min-h-screen flex flex-col bg-surface-bg selection:bg-brand-primary selection:text-white">
      <Navbar />
      <main className="w-full flex-1 px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl items-start gap-6">
          <Sidebar />
          <section className="min-w-0 flex-1">
            <Outlet />
          </section>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
