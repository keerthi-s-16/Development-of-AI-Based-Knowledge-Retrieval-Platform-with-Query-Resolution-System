import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post(
        "/auth/login",
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Login Success:", res.data);

      // Token is stored in HTTP-only cookie by backend.
      // No localStorage token is needed.

      navigate("/dashboard");
    } catch (err) {
      console.error("Login Error:", err);
      console.error("Backend Response:", err.response?.data);

      setError(
        err.response?.data?.detail ||
        "Invalid email or password"
      );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        <p style={styles.text}>
          Don't have an account?{" "}
          <a href="/signup">Signup</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8",
  },

  card: {
    width: "350px",
    padding: "30px",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },

  title: {
    marginBottom: "20px",
  },

  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },

  button: {
    width: "100%",
    padding: "10px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  text: {
    marginTop: "10px",
  },

  error: {
    color: "red",
  },
};

export default Login;