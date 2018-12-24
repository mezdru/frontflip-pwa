import React from 'react';
import {Avatar, Grid} from '@material-ui/core';
import Auth from '../../components/auth/Auth';

import './Auth.css'


const AuthPage = () => {
    
    return (
        <Grid container justify={"center"} className="root">
            <Grid className="banner-container" item container justify={"center"} alignItems={'stretch'} xs={12}>
                <div className="banner"/>
                <Avatar src="https://pbs.twimg.com/profile_images/981455890342694912/fXaclV2Y_400x400.jpg" alt="org-logo" id="logo"/>
            </Grid>
            <Grid item xs={12} sm={4} id="auth-form">
                <Auth/>
            </Grid>
        </Grid>
    )
};

export default AuthPage;
