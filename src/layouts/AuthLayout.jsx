import { Outlet } from "react-router";

// components
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AuthLayout = () => {
  return (
    <div className="min-h-dvh flex flex-col justify-center items-center">
      {/* <Navbar /> */}
      <Outlet />
      {/* <Footer /> */}
    </div>
  );
};

export default AuthLayout;
