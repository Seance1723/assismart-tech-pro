// src/auth/useAuth.js
import { useState } from "react";

// You can expand this to a Context for global state
export default function useAuth() {
  // Read user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login"; // or use your router
  }

  return {
    user,
    token,
    role: user?.role,
    logout,
  };
}
