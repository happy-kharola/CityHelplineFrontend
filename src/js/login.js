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
    if (res.user?.username || res.user?.name) {
      localStorage.setItem("username", res.user.username || res.user.name);
    }

    showMessage(`Welcome back, ${res.user?.username || res.user?.name || "User"}!`, "success");

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 800);

  } catch (error) {          // ← was missing (error) — caused ReferenceError
    console.error(error);
    showMessage(error.message || "Login failed. Please try again.", "error");

  } finally {
    loginBtn.disabled = false;
  }
});