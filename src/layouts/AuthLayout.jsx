import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="min-h-dvh flex flex-col justify-center items-center">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
