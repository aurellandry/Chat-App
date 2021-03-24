import React, { useState } from "react";
import Axios from 'axios';
import PropTypes from 'prop-types';
import { Alert, Form, Spinner } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import config from '../../config';

import "./Login.css";

export default function Login ({setToken}) {
    const [username, setUsername]           = useState("");
    const [password, setPassword]           = useState("");
    const [spinner, setSpinner]             = useState("");
    const [errorMessage, setErrorMessage]   = useState("");

    function validateForm() {
        return username.length > 0 && password.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();
        setSpinner(<Spinner animation="border" size="sm" />);
        login();
    }

    function redirect(url) {
        return window.location = url;
    }

    const login = () => {
        Axios.post(`${config.host}/auth/login`, {
            username: username,
            password: password,
        }).then((response) => {
            if (response.data.accessToken) {
                setToken(response.data.accessToken);

                sessionStorage.setItem("user.id", response.data.id);
                sessionStorage.setItem("user.username", response.data.username);
                sessionStorage.setItem("user.name", response.data.name);
                sessionStorage.setItem("user.first_name", response.data.first_name);
                sessionStorage.setItem("user.email", response.data.email);
                sessionStorage.setItem("token", response.data.accessToken);

                redirect("/");
            }
            else {
                setSpinner("");
                setErrorMessage(response.data.message);
            }
        });
    }

    return (
        <div className="Login">
            <Form onSubmit={handleSubmit}>
                <Form.Group size="lg" controlId="username">
                    <Form.Label>Nom d'utilisateur</Form.Label>
                    <Form.Control
                        autoFocus
                        type="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>

                <Form.Group size="lg" controlId="password">
                    <Form.Label>Mot de passe</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                { errorMessage ?
                <Alert key="errorMessage" variant="danger">
                    {errorMessage}
                </Alert>
                :
                ''
                }

                <Button block size="lg" type="submit" disabled={!validateForm()}>
                    {spinner} Connexion
                </Button>
            </Form>
        </div>
    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
};