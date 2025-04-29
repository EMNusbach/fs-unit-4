import { MdPerson, MdLock } from 'react-icons/md';
import { useState } from "react";
import classes from './LoginSignup.module.css';

let didAutoLogin = false; // Ensures auto-login logic runs only once

function LoginSignup({ onLogin }) {
    // State hooks
    const [action, setAction] = useState("Login");                // Determines current view: "Login" or "Sign Up"
    const [username, setUsername] = useState("");                 // Input username
    const [password, setPassword] = useState("");                 // Input password
    const [confirmPassword, setConfirmPassword] = useState("");   // Confirm password (Sign Up only)

    // Auto-login using saved cookies, only once
    if (!didAutoLogin) {
        didAutoLogin = true;
        setTimeout(() => {
            const savedUsername = getCookie('user_name');
            const savedPassword = getCookie('user_password');
            const users = JSON.parse(localStorage.getItem("users")) || {};

            if (savedUsername && savedPassword) {
                const user = users[savedUsername];
                if (user && user.password === savedPassword) {
                    onLogin(savedUsername); // Trigger login callback
                }
            }
        }, 0);
    }

    // Handle form submission (Login or Sign Up)
    function handleSubmit(e) {
        e.preventDefault(); // prevent page reload
        const users = JSON.parse(localStorage.getItem("users")) || {};

        // Handle Sign Up
        if (action === "Sign Up") {
            if (!username || !password || !confirmPassword) {
                alert("Please fill in all fields.");
                return;
            }

            if (password !== confirmPassword) {
                alert("Passwords do not match. Please try again.");
                return;
            }

            if (users[username]) {
                alert("Username already exists!");
                return;
            }

            // Register new user
            users[username] = {
                password,
                notes: []
            };

            localStorage.setItem("users", JSON.stringify(users));
            alert("User registered successfully!");

            // Switch to login mode
            setAction("Login");
            setPassword("");
            setConfirmPassword("");
        }

        // Handle Login
        else if (action === "Login") {
            if (!users[username]) {
                alert("Username does not exist.");
                return;
            }

            if (users[username].password !== password) {
                alert("Incorrect password.");
                return;
            }

            // Set session cookies and localStorage
            setCookie('user_name', username, 12);
            setCookie('user_password', password, 12);
            localStorage.setItem("current_user", JSON.stringify({ username }));

            onLogin(username); // Trigger login callback
        }
    }

    return (
        <div className={classes.body}>
            <div className={classes.container}>
                <div className={classes.header}>
                    <h1 className={classes.text}>{action}</h1>
                    <div className={classes.underLine}></div>
                </div>

                <form className={classes.inputs} onSubmit={handleSubmit}>
                    {/* Username input */}
                    <div className={classes.input}>
                        <MdPerson className={classes.icon} />
                        <input
                            type="text"
                            placeholder='User Name'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required />
                    </div>

                    {/* Password input */}
                    <div className={classes.input}>
                        <MdLock className={classes.icon} />
                        <input
                            type="password"
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required />
                    </div>

                    {/* Confirm password input (Sign Up only) */}
                    {action === "Sign Up" && (
                        <div className={classes.input}>
                            <MdLock className={classes.icon} />
                            <input
                                type="password"
                                placeholder='Confirm password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required />
                        </div>
                    )}

                    {/* Switch to Sign Up link (only visible in Login mode) */}
                    {action === "Login" && (
                        <p className={classes.link}>
                            Don't have an account?{" "}
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setAction("Sign Up");
                                }}
                            >Sign up</a>
                        </p>
                    )}

                    {/* Submit button */}
                    < button type="submit" className={classes.submit} >{action}</button>
                </form>

            </div>
        </div >

    )
}


// Utility: Set cookie with expiration in hours
function setCookie(name, value, hours) {
    const expires = new Date(Date.now() + hours * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

// Utility: Get cookie value by name
function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === name) return value;
    }
    return null;
}

export default LoginSignup;