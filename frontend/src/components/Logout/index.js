import React from 'react';
import { Redirect } from 'react-router-dom';

function logoutUser(){
    sessionStorage.clear();
    localStorage.clear();
}

export default function Logout() {

    logoutUser()
    return(
        <Redirect to='/connexion' />
    );

}