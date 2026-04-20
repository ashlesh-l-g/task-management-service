import { useState } from "react";
import { login } from "../api";

type Props = {
  onLogin: (token: string) => void;
  goToRegister: () => void;
};

export default function Login({ onLogin, goToRegister }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await login(email, password);
      onLogin(res.token);
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />

      <button onClick={handleSubmit}>Login</button>

      <p onClick={goToRegister} style={{ cursor: "pointer" }}>
        Create account
      </p>
    </div>
  );
}