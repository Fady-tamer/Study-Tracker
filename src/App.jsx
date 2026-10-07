import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

// layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

// pages
import LoginPage from "./pages/Auth/Login";
import Home from "./pages/Home";
import RegistrationPage from "./pages/Auth/Registration";

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
          <Route path="/home" element={<MainLayout />}>
            <Route index element={<Home />} />
          </Route>
        </Route>
      </Routes>

      <Toaster position="top-right" />
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
