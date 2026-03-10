import {signupUser} from "../services/authService.js";


const form = document.getElementById("signupForm");
const message = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");

function showMessage(text,type){
    message.textContent =  text;
    message.className =  `message ${type}`; 
}

form.addEventListener('submit', async (e)=>{
    
    e.preventDefault();
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    
    if(password.value != confirmPassword.value){
        showMessage("Password do not match. Try again.","error");
        return;
    }

    submitBtn.disabled = true;
    // submitBtn.textContent = 'Creating account...'; 
    // when using abone line, you have change back text to orgignal too

    const data = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        email: document.getElementById("email").value 
    };

    try{
        const response = await signupUser(data);
        showMessage(response.message);

    }catch(error){

        console.error(error);
        showMessage("Signup Failed. Please try again.", "error");
    
    }finally{
        submitBtn.disabled = false;
    }
    
    //"finally" the code that must run despite "try" success or not.//
    
})

// SERVER REQUIREMENTs
// expecting server to redirect to login page in  successive response.
// user in json the user's name with key name 'username' not 'userName'