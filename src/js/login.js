import { loginUser } from "../services/authService.js";

const form = document.getElementById("loginForm");
const message = document.getElementById("message");
const loginBtn = document.getElementById("loginBtn");

function showMessage(text,type){
    message.textContent =  text;
    message.className =  `message ${type}`; 
}

form.addEventListener("submit", async (e) => {

    e.preventDefault();
    loginBtn.disabled = true; 
    // loginBtn.textContent = 'Loggin in...';
    
    const data = {
        email : document.getElementById("email").value, 
        password: document.getElementById("password").value
    }

    try{
        const response = await loginUser(data);
        showMessage(response.message);

    }catch{
        showMessage("Login Failed. Please try again","error");

    }finally{
        loginBtn.disabled = false;
    }

    loginBtn.disabled = false;
});