//API communication

export async function signupUser(userData){
    const response = await fetch("/api/signup",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    return response.json();
}

export async function loginUser(userData){
    const response = await fetch("/api/login",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    return response.json();
}