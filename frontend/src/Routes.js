import React, { useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import GuardedRoute from './GuardedRoute';
import Login from './components/Login/index';
import Logout from './components/Logout/index';
import Register from './components/Register/index';
import Error from './components/Error/index';
import Messenger from './components/Messenger';

function isAuth(token){
    if(!token){
        return false
    }
    return true
}

export default function Routes() {
    const [token, setToken] = useState(sessionStorage.getItem('token'));
    const isAuthenticated   = isAuth(token);

    return (
        <BrowserRouter>
            <Switch>
                <Route path="/connexion">
                    <Login setToken={setToken} />
                </Route>
                <Route exact path="/inscription">
                    <Register />
                </Route>
                <Route path="/deconnexion">
                    <Logout />
                </Route>
                <GuardedRoute component={Messenger} auth={isAuthenticated} path="/" />
                <Route>
                    <Error />
                </Route>
            </Switch>
        </BrowserRouter>
    );
}