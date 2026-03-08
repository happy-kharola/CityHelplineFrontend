import {signupUser} from "../services/authService.js";

const form = document.getElementById("signupForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) =>{
    e.preventDefault();
    const data = {
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        password : document.getElementById("password").value
    };

    const result = await signupUser(data);
    message.textContent = result.message;
});