const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();
const port = 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: "secret123",
    resave: false,
    saveUninitialized: true
}));

// Login page
app.get("/", (req, res) => {
    res.render("login", { message: "" });
});

// Login
app.post("/login", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (username === "admin" && password === "123") {

        // Store username in session
        req.session.user = username;

        // Create cookie
        res.cookie("lastLogin", new Date().toLocaleString());

        res.redirect("/home");

    } else {
        res.render("login", {
            message: "Invalid username or password"
        });
    }
});

// Home page
app.get("/home", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/");
    }

    const lastLogin = req.cookies.lastLogin || "First Login";

    res.render("home", {
        user: req.session.user,
        lastLogin: lastLogin
    });
});

// Logout
app.get("/logout", (req, res) => {

    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.redirect("/");
    });

});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});