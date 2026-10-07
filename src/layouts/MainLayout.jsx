import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <div className="grow flex mx-4">
        <div className="grow flex mx-auto mb-4 max-w-470">
          <Sidebar />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
