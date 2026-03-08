// dummy server for testing

const express = require("express");
const app = express();
const PORT = 3000;

// does somthing kinda like allow json data
app.use(express.json());

//serves frontend files
app.use(express.static("../src"));

//signup route
app.post("/api/signup",(req, res) => {
    const { username, email, password } = req.body;

    console.log("Signup data:", username, email, password);

    res.json({
        message: "Signup successfull (dummy server)"
    });
});


//login route
app.post("/api/login", (req, res) => {
    const {email, password } = req.body;
    console.log("Login Data: ", email, password);

    res.json({ message : "Login successful (dummy server)"});
});

app.listen(PORT, () =>{
    console.log(`Server running at http://localhost:${PORT}`);
});
