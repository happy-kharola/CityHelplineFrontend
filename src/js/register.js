import { registerUser } from "../services/authService.js";

const form      = document.getElementById("signupForm");
const message   = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");

function showMessage(text, type) {
  message.textContent = text;
  message.className   = `message ${type}`;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const password        = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    showMessage("Passwords do not match. Try again.", "error");
    return;
  }

  submitBtn.disabled = true;

  //DATA OF REQ.

  const data = {
    name: document.getElementById("username").value.trim(),
    email:    document.getElementById("email").value.trim(),
    password,
  };

  try {
    const res = await registerUser(data);

    localStorage.setItem("token", res.token);
    if (res.user?.name) {
      localStorage.setItem("name",res.user.name);
    }

    showMessage(`Account created! Welcome, ${res.user?.name || "User"}!`, "success");

    setTimeout(() => {
      if(req.user?.role === "admin"){
        window.location.href = "admin-dashboard.html";
      }else {
        window.location.href = "dashboard.html";
      }
    }, 800);

  } catch (error) {
    console.error(error);
    showMessage(error.message || "Signup failed. Please try again.", "error");

  } finally {
    submitBtn.disabled = false;
  }
});