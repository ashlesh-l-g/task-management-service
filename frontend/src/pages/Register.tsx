import { useState } from "react";
import { register } from "../api";

type Props = {
  onRegister: () => void;
  goToLogin: () => void;
};

export default function Register({ onRegister, goToLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      await register(email, password);
      alert("Registration successful");
      onRegister();
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>

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

      <button onClick={handleSubmit}>Register</button>

      <p onClick={goToLogin} style={{ cursor: "pointer" }}>
        Back to login
      </p>
    </div>
  );
}