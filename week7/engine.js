const express = require("express");

const app = express();
const port = 3000;

// Use EJS
app.set("view engine", "ejs");

// Read form data
app.use(express.urlencoded({ extended: true }));

// Home page
app.get("/", (req, res) => {
    res.render("index", {
        title: "User Registration",
        error: null,
        user: null
    });
});

// Registration form
app.post("/register", (req, res) => {

    const username = req.body.username;
    const age = req.body.age;

    // Check username
    if (username.length < 3) {
        return res.render("index", {
            title: "Registration Failed",
            error: "Username must be at least 3 characters long",
            user: null
        });
    }

    // Check age
    if (age < 18) {
        return res.render("index", {
            title: "Registration Failed",
            error: "You must be at least 18 years old",
            user: null
        });
    }

    // If validation is successful
    res.render("index", {
        title: "Registration Successful",
        error: null,
        user: username
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});