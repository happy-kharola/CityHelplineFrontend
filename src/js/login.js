import { loginUser } from "../services/authService.js";

const form = document.getElementById("loginForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
        email : document.getElementById("email").value, 
        password: document.getElementById("password").value
    }

    const result = await loginUser(data);
    message.textContent = result.message;
});