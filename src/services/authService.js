//API communication

export async function signupUser(userData){
    const response = await fetch("http://localhost:3000/api/signup",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    return response.json();
}

export async function loginUser(userData){
    const response = await fetch("http://localhost:3000/api/login",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    return response.json();
}