import { MdPerson, MdLock } from 'react-icons/md';
import { useState } from "react";
import classes from './LoginSignup.module.css';

let didAutoLogin = false; // Run auto-login once only


function LoginSignup({ onLogin }) {
    const [action, setAction] = useState("Login");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    if (!didAutoLogin) {
        didAutoLogin = true;
        setTimeout(() => {
          const savedUsername = getCookie('user_name');
          const savedPassword = getCookie('user_password');
          const users = JSON.parse(localStorage.getItem("users")) || {};
      
          if (savedUsername && savedPassword) {
            const user = users[savedUsername];
            if (user && user.password === savedPassword) {
              onLogin(savedUsername); // auto-login
            }
          }
        }, 0);
      }
      

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

            // Save password, and empty notes array
            users[username] = {
                password,
                notes: []
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

            setCookie('user_name', username, 12);
            setCookie('user_password', password, 12);
            localStorage.setItem("current_user", JSON.stringify({ username }));
                        
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


function setCookie(name, value, hours) {
    const expires = new Date(Date.now() + hours * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  }
  
  function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
      const [key, value] = cookie.split('=');
      if (key === name) return value;
    }
    return null;
  }
  
export default LoginSignup;