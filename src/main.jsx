import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import MainContext from "./context/MainContext.jsx";

createRoot(document.getElementById("root")).render(
  <MainContext>
    <App />
  </MainContext>,
);
