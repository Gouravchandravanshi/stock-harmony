import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { LoaderProvider } from './contexts/LoaderContext';
import { AuthProvider } from './contexts/AuthContext';

createRoot(document.getElementById("root")).render(
  <LoaderProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </LoaderProvider>
);
