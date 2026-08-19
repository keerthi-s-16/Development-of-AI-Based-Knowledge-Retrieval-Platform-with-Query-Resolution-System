import React, { useState } from "react";

function Signup() {
  const [name, setName] = useState("");   // ✅ ADD THIS
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,       // ✅ ADD THIS
          email,
          password,
        }),
      });

      const data = await res.json();
      console.log("Signup Response:", data);

      if (res.ok) {
        alert("Signup successful!");
        setName("");     // ✅ reset
        setEmail("");
        setPassword("");
      } else {
        alert(data.detail || "Signup failed!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server not reachable!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px", fontFamily: "Arial" }}>
      <h1>Signup Page</h1>

      {/* ✅ NAME INPUT ADDED */}
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ padding: "10px", width: "250px" }}
      />

      <br /><br />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: "10px", width: "250px" }}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: "10px", width: "250px" }}
      />

      <br /><br />

      <button
        onClick={handleSignup}
        disabled={loading}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        {loading ? "Signing up..." : "Signup"}
      </button>
    </div>
  );
}

export default Signup;