import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";
import { Analytics } from '@vercel/analytics/react';

// layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

// pages
import LoginPage from "./pages/Auth/Login";
import Home from "./pages/Home";
import RegistrationPage from "./pages/Auth/Registration";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<LoginPage />} />
          <Route path="registration" element={<RegistrationPage />} />
        </Route>

        <Route path="/home" element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>

      <Toaster position="top-right" />
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
