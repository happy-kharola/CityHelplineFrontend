import { API_BASE } from "../js/config.js";
import { getToken } from "../utils/auth.js";

// POST /api/auth/register
export async function signupUser(userData) {
  const response = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Signup failed");
  return data;
}

// POST /api/auth/login
export async function loginUser(userData) {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Login failed");
  return data;
}

// GET /api/auth/profile  (requires token)
export async function getCurrentUser() {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const res = await fetch(`${API_BASE}/api/auth/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Session expired or unauthorized");
  return await res.json();
}