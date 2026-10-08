import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

// layouts
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";

// pages
import RegistrationPage from "./pages/Auth/Registration";
import LoginPage from "./pages/Auth/Login";
import Home from "./pages/Home";
import CoursesPage from "./pages/Courses";
import CourseDetailsPage from "./pages/CourseDetails";
import ErrorPage from "./pages/Error";

// routs
import ProtectedPages from "./routes/ProtectedPages";
import ProtectedAuth from "./routes/ProtectedAuth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedAuth />}>
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<LoginPage />} />
            <Route path="registration" element={<RegistrationPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedPages />}>
          <Route element={<MainLayout />}>
            <Route path="home" element={<Home />} />

            {/* Courses layout route */}
            <Route path="myCourses" element={<CoursesPage />} />
            <Route path="myCourses/:id" element={<CourseDetailsPage />} />

            {/* setting / user page */}
            <Route path="setting" element />
          </Route>
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Routes>

      <Toaster position="bottom-center" />
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
