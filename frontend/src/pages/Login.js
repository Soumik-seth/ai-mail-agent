import { useState } from "react";
import axios from "axios";
import "./auth.css";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        phone,
        password,
      });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/chat";
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        phone,
        password,
      });
      alert("Registered successfully! Now login.");
      setMode("login");
    } catch (err) {
      alert(err.response?.data?.msg || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">

      {/* Top brand bar */}
      <div className="auth-topbar">
        <div className="auth-brand">
          <div className="auth-brand-icon">✉</div>
          <span className="auth-brand-name">AI Mail Sender</span>
        </div>
        <div className="auth-status">
          <span className="status-dot" />
          Online
        </div>
      </div>

      {/* Centered login card */}
      <div className="auth-card">

        {/* Header */}
        <div className="card-header">
          <div className="card-icon">✉</div>
          <h1 className="card-title">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p className="card-subtitle">
            {mode === "login"
              ? "Sign in to AI Mail Sender to continue"
              : "Get started with AI Mail Sender today"}
          </p>
        </div>

        {/* Login / Register tabs */}
        <div className="auth-tabs">
          <div className={`tab-pill${mode === "register" ? " right" : ""}`} />
          <button
            className={`tab-btn${mode === "login" ? " active" : ""}`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`tab-btn${mode === "register" ? " active" : ""}`}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <div className="auth-form">
          <div className="form-group">
            <label className="form-label">Phone number</label>
            <div className="field-wrap">
              <span className="field-ico">
                <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              </span>
              <input
                className="field-input"
                placeholder="+91 00000 00000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="field-wrap">
              <span className="field-ico">
                <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              </span>
              <input
                className="field-input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            className="auth-btn"
            onClick={mode === "login" ? login : register}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner" />
            ) : mode === "login" ? (
              <>Sign In <span className="btn-arrow">→</span></>
            ) : (
              <>Create Account <span className="btn-arrow">→</span></>
            )}
          </button>
        </div>

        <p className="auth-foot">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            className="link-btn"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
