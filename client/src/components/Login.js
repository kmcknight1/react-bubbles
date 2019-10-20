import React, { useState } from "react";
import axios from "axios";
import { FormGroup, Input, Button } from "@material-ui/core";

import { handleChange } from "../functions";
import { buttonVariant } from "../variables";
import Modal from "./Modal";

const Login = props => {
  // make a post request to retrieve a token from the api
  // when you have handled the token, navigate to the BubblePage route
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);

  function doLogin(body) {
    axios
      .post("http://localhost:5000/api/login", body)
      .then(res => {
        localStorage.setItem("token", res.data.payload);
        props.history.push("/bubbles");
      })
      .catch(err => {
        setError(err.response.data.error);
      });
  }

  function handleClose() {
    setUsername("");
    setPassword("");
    setError("");
    setIsPrompting(false);
  }

  return (
    <div className="login">
      {isPrompting && (
        <Modal
          content={
            <>
              <h3>Username: katie</h3>
              <h3>Password: 1234</h3>
            </>
          }
          handleClose={handleClose}
        />
      )}
      {error && <Modal content={<h2>{error}</h2>} handleClose={handleClose} />}
      <h1>Login to the Bubble App!</h1>

      <form
        className="login-form"
        onSubmit={e => {
          e.preventDefault();
          const body = { username, password };
          doLogin(body);
        }}
      >
        <Input
          onChange={e => handleChange(e, setUsername)}
          placeholder="username"
          value={username}
        />
        <Input
          onChange={e => handleChange(e, setPassword)}
          placeholder="password"
          value={password}
        />
        <Button type="submit" variant={buttonVariant}>
          Submit
        </Button>
      </form>
      <p className="propmt-link" onClick={() => setIsPrompting(true)}>
        Forgot username or password?
      </p>
    </div>
  );
};

export default Login;
