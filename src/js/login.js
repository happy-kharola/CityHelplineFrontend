import { loginUser } from "../services/authService.js";

const form     = document.getElementById("loginForm");
const message  = document.getElementById("message");
const loginBtn = document.getElementById("loginBtn");

function showMessage(text, type) {
  message.textContent = text;
  message.className   = `message ${type}`;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginBtn.disabled = true;

  const data = {
    email:    document.getElementById("email").value.trim(),
    password: document.getElementById("password").value,
  };

  try {
    const res = await loginUser(data);

    localStorage.setItem("token", res.token);

    // Store username for navbar greeting (use whatever field your server returns)
    if (res.user?.name) {
      localStorage.setItem("name", res.user.name);
    }
    // store role
    if (res.user?.role) {
      localStorage.setItem("role", res.user.role);
    }

    showMessage(`Welcome back, ${res.user?.name || "User"}!`, "success");

    setTimeout(() => {
      if(res.user?.role === "admin"){
        window.location.href = "admin-dashboard.html";
      } else {
        window.location.href = "dashboard.html";
      }
    }, 400);

  } catch (error) {          // ← was missing (error) — caused ReferenceError
    console.error(error);
    showMessage(error.message || "Login failed. Please try again.", "error");

  } finally {
    loginBtn.disabled = false;
  }
});