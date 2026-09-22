import { BrowserRouter, Route, Routes } from "react-router";

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
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>

        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<LoginPage />} />
          <Route index element={<RegistrationPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
