import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

type View = "login" | "register" | "dashboard";

export default function App() {
  const [view, setView] = useState<View>("login");
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const handleLogin = (token: string) => {
    localStorage.setItem("token", token);
    setToken(token);
    setView("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setView("login");
  };

  if (!token) {
    if (view === "login") {
      return (
        <Login
          onLogin={handleLogin}
          goToRegister={() => setView("register")}
        />
      );
    }

    return (
      <Register
        onRegister={() => setView("login")}
        goToLogin={() => setView("login")}
      />
    );
  }

  return <Dashboard token={token} onLogout={handleLogout} />;
}