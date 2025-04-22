import { MdPerson, MdLock } from 'react-icons/md';
import { useState } from "react";
import classes from './LoginSignup.module.css';

function LoginSignup({ onLogin }) {
    const [action, setAction] = useState("Login");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    function handleSubmit(e) {
        e.preventDefault(); // prevent page reload

        const users = JSON.parse(localStorage.getItem("users")) || {};

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

            // Save password, and empty texts array
            users[username] = {
                password,
                texts: []
            };

            localStorage.setItem("users", JSON.stringify(users));
            alert("User registered successfully!");
            setAction("Login");
            setPassword("");
            setConfirmPassword("");
        }
        else if (action === "Login") {
            if (!users[username]) {
                alert("Username does not exist.");
                return;
            }

            if (users[username].password !== password) {
                alert("Incorrect password.");
                return;
            }

            onLogin(username); //call parent login handler
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
                    <div className={classes.input}>
                        <MdPerson className={classes.icon} />
                        <input type="text" placeholder='User Name' value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className={classes.input}>
                        <MdLock className={classes.icon} />
                        <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    {action === "Sign Up" && (
                        <div className={classes.input}>
                            <MdLock className={classes.icon} />
                            <input type="password" placeholder='Confirm password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </div>
                    )}

                    {action === "Login" && (
                        <p className={classes.link}>Don't have an account?{" "}<a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setAction("Sign Up");
                            }}
                        >
                            Sign up
                        </a>
                        </p>
                    )}


                    < button type="submit" className={classes.submit} >{action}</button>
                </form>

            </div>
        </div >

    )
}


export default LoginSignup;