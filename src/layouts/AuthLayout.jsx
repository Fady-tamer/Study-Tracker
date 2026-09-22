import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

const AuthLayout = () => {
  return (
    <div className="min-h-dvh">
      <Navbar />
      <Outlet/>
    </div>
  );
};

export default AuthLayout;
