import React from 'react';

import { Nav, Navbar, NavDropdown } from 'react-bootstrap';


export default function Navigation() {
    return (
        <>
            <Navbar bg="primary" variant="dark" style={{ marginBottom: "15px" }}>
                <Navbar.Brand href="/">
                    ChatApp
                </Navbar.Brand>

                <Nav className="mr-auto">
                </Nav>
                
                <Nav className="justify-content-end">
                    {
                        sessionStorage.getItem('token') ?
                        <NavDropdown title={sessionStorage.getItem('user.first_name')} id="basic-nav-dropdown">
                            <NavDropdown.Item href="/deconnexion">Déconnexion</NavDropdown.Item>
                        </NavDropdown>
                        : ''
                    }
                </Nav>
            </Navbar>
        </>
    );
}