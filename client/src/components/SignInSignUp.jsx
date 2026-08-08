import React, { useState } from "react";

// ============================================
// SignInSignUp.jsx
// ============================================
// Drop this file into your React project (src/components/ or src/pages/)
// Install axios if you haven't: npm install axios
// ============================================

import axios from "axios";

const API_BASE = "http://localhost:5000/api/auth"; // <-- CHANGE THIS TO YOUR BACKEND URL

const SignInSignUp = () => {
  const [activeTab, setActiveTab] = useState("login"); // "login" | "register"
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" }); // type: "success" | "error"

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
    age: "",
    contact: "",
  });

  const showMessage = (text, type = "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/login`, loginData);

      // Save token & user to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      showMessage(res.data.message, "success");

      // Optional: redirect after login
      // setTimeout(() => window.location.href = "/dashboard", 1000);
    } catch (err) {
      showMessage(
        err.response?.data?.message || "Login failed. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...registerData,
        age: parseInt(registerData.age),
      };

      const res = await axios.post(`${API_BASE}/register`, payload);

      showMessage(res.data.message, "success");

      // Reset form and switch to login tab
      setRegisterData({
        username: "",
        email: "",
        password: "",
        role: "user",
        age: "",
        contact: "",
      });

      setTimeout(() => setActiveTab("login"), 1500);
    } catch (err) {
      showMessage(
        err.response?.data?.message || "Registration failed. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // STYLES (CSS-in-JS)
  // ============================================
  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    card: {
      background: "white",
      borderRadius: "20px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      width: "100%",
      maxWidth: "450px",
      overflow: "hidden",
    },
    tabs: {
      display: "flex",
      background: "#f8f9fa",
    },
    tabBtn: (isActive) => ({
      flex: 1,
      padding: "18px",
      border: "none",
      background: isActive ? "white" : "transparent",
      fontSize: "16px",
      fontWeight: 600,
      color: isActive ? "#667eea" : "#666",
      cursor: "pointer",
      transition: "all 0.3s ease",
      position: "relative",
      borderBottom: isActive ? "3px solid #667eea" : "3px solid transparent",
    }),
    formContainer: {
      padding: "35px 30px",
    },
    heading: {
      textAlign: "center",
      color: "#333",
      marginBottom: "25px",
      fontSize: "24px",
    },
    message: (type) => ({
      padding: "12px",
      borderRadius: "8px",
      marginBottom: "15px",
      fontSize: "14px",
      textAlign: "center",
      display: type ? "block" : "none",
      background: type === "success" ? "#d4edda" : type === "error" ? "#f8d7da" : "transparent",
      color: type === "success" ? "#155724" : type === "error" ? "#721c24" : "inherit",
      border: type === "success" ? "1px solid #c3e6cb" : type === "error" ? "1px solid #f5c6cb" : "none",
    }),
    inputGroup: {
      marginBottom: "18px",
    },
    label: {
      display: "block",
      marginBottom: "6px",
      color: "#555",
      fontSize: "14px",
      fontWeight: 500,
    },
    input: {
      width: "100%",
      padding: "12px 15px",
      border: "2px solid #e0e0e0",
      borderRadius: "10px",
      fontSize: "14px",
      outline: "none",
      transition: "border-color 0.3s ease",
      fontFamily: "inherit",
    },
    select: {
      width: "100%",
      padding: "12px 15px",
      border: "2px solid #e0e0e0",
      borderRadius: "10px",
      fontSize: "14px",
      outline: "none",
      transition: "border-color 0.3s ease",
      fontFamily: "inherit",
      background: "white",
    },
    row: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
    },
    submitBtn: {
      width: "100%",
      padding: "14px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      border: "none",
      borderRadius: "10px",
      fontSize: "16px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      marginTop: "10px",
    },
    submitBtnHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 20px rgba(102, 126, 234, 0.4)",
    },
    spinner: {
      display: "inline-block",
      width: "16px",
      height: "16px",
      border: "2px solid rgba(255,255,255,0.3)",
      borderRadius: "50%",
      borderTopColor: "white",
      animation: "spin 0.8s linear infinite",
      marginRight: "8px",
      verticalAlign: "middle",
    },
  };

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={styles.card}>
        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={styles.tabBtn(activeTab === "login")}
            onClick={() => setActiveTab("login")}
          >
            Sign In
          </button>
          <button
            style={styles.tabBtn(activeTab === "register")}
            onClick={() => setActiveTab("register")}
          >
            Sign Up
          </button>
        </div>

        <div style={styles.formContainer}>
          {/* ============== LOGIN FORM ============== */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin}>
              <h2 style={styles.heading}>Welcome Back!</h2>

              <div style={styles.message(message.type)}>{message.text}</div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                  style={styles.input}
                  onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                  onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                  style={styles.input}
                  onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                  onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.submitBtn,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
                  <>
                    <span style={styles.spinner}></span>
                    Please wait...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          )}

          {/* ============== REGISTER FORM ============== */}
          {activeTab === "register" && (
            <form onSubmit={handleRegister}>
              <h2 style={styles.heading}>Create Account</h2>

              <div style={styles.message(message.type)}>{message.text}</div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  value={registerData.username}
                  onChange={handleRegisterChange}
                  required
                  style={styles.input}
                  onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                  onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  required
                  style={styles.input}
                  onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                  onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  minLength={6}
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  required
                  style={styles.input}
                  onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                  onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                />
              </div>

              <div style={styles.row}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Role</label>
                  <select
                    name="role"
                    value={registerData.role}
                    onChange={handleRegisterChange}
                    required
                    style={styles.select}
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Age</label>
                  <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    min={1}
                    max={120}
                    value={registerData.age}
                    onChange={handleRegisterChange}
                    required
                    style={styles.input}
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Contact</label>
                <input
                  type="text"
                  name="contact"
                  placeholder="Phone number"
                  value={registerData.contact}
                  onChange={handleRegisterChange}
                  required
                  style={styles.input}
                  onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                  onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.submitBtn,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
                  <>
                    <span style={styles.spinner}></span>
                    Please wait...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignInSignUp;