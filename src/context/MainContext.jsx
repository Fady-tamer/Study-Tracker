import { createContext, useState } from "react";

export const mainStore = createContext();

const MainContext = ({ children }) => {
  const [courses, setCourses] = useState(
    JSON.parse(localStorage.getItem("courses")) || [],
  );

  const saveCourses = (fetchedCourses) => {
    localStorage.setItem("courses", JSON.stringify(courses));
    setCourses(fetchedCourses);
  };

  const [showAddCourse, setShowAddCourse] = useState(false);

  const logout = () => {
    localStorage.removeItem("sb-xmisjflcmdohrhgyofro-auth-token");
  };

  const contextValue = {
    showAddCourse,
    setShowAddCourse,
    courses,
    saveCourses,
    logout,
  };

  return (
    <mainStore.Provider value={contextValue}>{children}</mainStore.Provider>
  );
};

export default MainContext;
