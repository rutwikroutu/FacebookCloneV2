import React, { useState } from "react";
import "./Login.css";
import { auth } from "./firebase";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";

function Login() {
  const history = useHistory("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const login = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .then((auth) => {
        history.push("/");
      })
      .catch((e) => {
        if (
          e.message ===
          "The password is invalid or the user does not have a password."
        ) {
          alert("Please check your credentials again");
        } else if (
          e.message ===
          "There is no user record corresponding to this identifier. The user may have been deleted."
        ) {
          history.push("/register");
          window.scrollTo({
            top: document.body.scrollHeight,
            left: 0,
            behavior: "smooth",
          });
        } else {
          alert(e.message);
        }
      });
  };

  return (
    <div className="login">
      <img src="https://static.xx.fbcdn.net/rsrc.php/y8/r/dF5SId3UHWd.svg" class="login__logo" />
      <div className="login__container">
        <h3>Log in to Facebook</h3>
        <form>
          <center>
            <input
              type="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email Address"
            />

          </center>
          <center>
            <input
              type="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
            />
          </center>
          <center>
            <button onClick={login} type="submit" class="login__login">
              Log In
            </button>
          </center>
          <center>
            <div class="sideinfo">
              <h5>Forgotten Password?</h5>
              <h5 class="dot">·</h5>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <h5 class="rtd">Sign up for Facebook</h5>
              </Link>
            </div>
          </center>
        </form>
      </div>
    </div>
  );
}

export default Login;
