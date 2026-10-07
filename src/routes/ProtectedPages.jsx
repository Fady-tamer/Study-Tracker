import { Navigate, Outlet } from "react-router";

const ProtectedPages = () => {
  const user =
    null || localStorage.getItem("sb-xmisjflcmdohrhgyofro-auth-token");
  return user ? <Outlet /> : <Navigate to={"/"} />;
};

export default ProtectedPages;
