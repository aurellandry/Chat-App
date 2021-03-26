import React from 'react';
import { Route, Redirect } from "react-router-dom";

const GuardedRoute = ({ component: Component, auth, ws, ...rest }) => (
    <Route {...rest} render={(props) => (
        auth === true
            ? <Component ws={ws} {...props} />
            : <Redirect to='/connexion' />
    )} />
)

export default GuardedRoute;