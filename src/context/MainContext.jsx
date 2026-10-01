import { createContext } from "react";
import { useNavigate } from "react-router";

export const mainStore = createContext();

const MainContext = ({ children }) => {
  const logout = () => {
    localStorage.removeItem("sb-xmisjflcmdohrhgyofro-auth-token");
  };

  const contextValue = {
    logout,
  };

  return (
    <mainStore.Provider value={contextValue}>{children}</mainStore.Provider>
  );
};

export default MainContext;
