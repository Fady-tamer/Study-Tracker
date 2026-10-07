import { Navigate, Outlet } from "react-router";

const ProtectedAuth = () => {
  const user =
    null || localStorage.getItem("sb-xmisjflcmdohrhgyofro-auth-token");
  return user ? <Navigate to={"/home"} /> : <Outlet />;
};

export default ProtectedAuth;
