import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

// context
import MainContext from "./context/MainContext";

// layouts
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";

// pages
import {
  Home,
  CoursesPage,
  CourseDetailsPage,
  AssignmentPage,
  CalendarPage,
  SettingPage,
  ErrorPage,
  LoginPage,
  RegistrationPage,
} from "./pages";

// routes
import ProtectedPages from "./routes/ProtectedPages";
import ProtectedAuth from "./routes/ProtectedAuth";

function App() {
  return (
    <BrowserRouter>
      <MainContext>
        <Routes>
          {/* Guest / Auth Routes */}
          <Route element={<ProtectedAuth />}>
            <Route path="/" element={<AuthLayout />}>
              <Route index element={<LoginPage />} />
              <Route path="registration" element={<RegistrationPage />} />
            </Route>
          </Route>

          {/* Authenticated / App Routes */}
          <Route element={<ProtectedPages />}>
            <Route element={<MainLayout />}>
              <Route path="home" element={<Home />} />
              <Route path="myCourses" element={<CoursesPage />} />
              <Route path="myCourses/:id" element={<CourseDetailsPage />} />
              <Route path="assignments" element={<AssignmentPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="setting" element={<SettingPage />} />
            </Route>
          </Route>

          {/* Catch-all 404 Route */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </MainContext>

      {/* Global Utilities */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "14px",
            background: "#ffffff",
            color: "#0f172a",
            fontSize: "13px",
            fontWeight: "600",
            border: "1px solid #e2e8f0",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)",
            padding: "12px 16px",
          },
        }}
      />
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
