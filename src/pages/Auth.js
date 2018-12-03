import React from 'react';
import Grid from '@material-ui/core/Grid';

import Logo from '../components/utils/logos/Logo';
import Form from '../components/login/Form';

import './Auth.css'


const Auth = () => {
    
    return (
        <Grid container direction={"colomn"} justify={"center"} className="root">
            <Grid item container direction={"colomn"} justify={"center"} alignItems={'stretch'} xs={12} style={{height:'45vh'}}>
                <div className="banner"/>
                <Logo src="https://ytimg.googleusercontent.com/vi/lcno0yGvP7o/mqdefault.jpg" alt="org-logo" id="logo"/>
            </Grid>
            <Grid item xs={12} sm={4} id="auth-form">
                <Form />
            </Grid>
        </Grid>
    )
};

export default Auth;
