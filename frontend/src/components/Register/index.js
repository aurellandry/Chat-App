import React, { useState } from "react";
import Axios from 'axios';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Register.css";
import config from '../../config';

const Register = () => {
    const [emailReg, setEmailReg] = useState("");
    const [passwordReg, setPasswordReg] = useState("");
    const [firstNameReg, setFirstNameReg] = useState("");
    const [lastNameReg, setLastNameReg] = useState("");
    const [addressReg, setAddressReg] = useState("");
    const [zipcodeReg, setZipcodeReg] = useState("");
    const [cityReg, setCityReg] = useState("");

    function validateForm() {
        return firstNameReg.length > 0 && lastNameReg.length > 0 && addressReg.length > 0 && zipcodeReg.length > 0 && cityReg.length > 0 && emailReg.length > 0 && passwordReg.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();
    }

    const register = () => {
        Axios.post(`${config.host}/register`, {
            email: emailReg,
            firstName: firstNameReg,
            lastName: lastNameReg,
            password: passwordReg,
            address: addressReg,
            zipcode: zipcodeReg,
            city: cityReg
        }).then((response) => {
            console.log(response)
        });
    }

    return (
        <div className="Register">
            <Form onSubmit={handleSubmit}>

                {/* NOM */}
                <Form.Group size="lg" controlId="lastName">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        value={lastNameReg}
                        onChange={(e) => setLastNameReg(e.target.value)}
                    />
                </Form.Group>

                {/* PRÉNOM */}
                <Form.Group size="lg" controlId="firstName">
                    <Form.Label>Prénom</Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        value={firstNameReg}
                        onChange={(e) => setFirstNameReg(e.target.value)}
                    />
                </Form.Group>

                {/* EMAIL */}
                <Form.Group size="lg" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        autoFocus
                        type="email"
                        value={emailReg}
                        onChange={(e) => setEmailReg(e.target.value)}
                    />
                </Form.Group>

                {/* MOT DE PASSE */}
                <Form.Group size="lg" controlId="password">
                    <Form.Label>Mot de passe</Form.Label>
                    <Form.Control
                        type="password"
                        value={passwordReg}
                        onChange={(e) => setPasswordReg(e.target.value)}
                    />
                </Form.Group>

                {/* ADRESSE */}
                <Form.Group size="lg" controlId="address">
                    <Form.Label>Adresse</Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        value={addressReg}
                        onChange={(e) => setAddressReg(e.target.value)}
                    />
                </Form.Group>

                {/* CODE POSTAL */}
                <Form.Group size="lg" controlId="zipcode">
                    <Form.Label>Code postal</Form.Label>
                    <Form.Control
                        autoFocus
                        type="zipcode"
                        value={zipcodeReg}
                        onChange={(e) => setZipcodeReg(e.target.value)}
                    />
                </Form.Group>

                {/* VILLE */}
                <Form.Group size="lg" controlId="city">
                    <Form.Label>Ville</Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        value={cityReg}
                        onChange={(e) => setCityReg(e.target.value)}
                    />
                </Form.Group>

                <Button block size="lg" onClick={register} disabled={!validateForm()}>
                    Inscription
                </Button>
            </Form>
        </div>
    );
}

export default Register;