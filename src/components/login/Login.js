import React from 'react';
import {inject, observer} from 'mobx-react';
import {Grid, Typography} from '@material-ui/core';

import Input from '../utils/inputs/InputWithRadius'

import './LoginSignup.css';
import ButtonRadius from '../utils/buttons/ButtonRadius';

let Login = inject("authStore")(observer(class Login extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
        };
        // Because we can't access to this in the class
        window.self = this;
    }
    
    componentWillUnmount() {
        // window.self.props.authStore.reset();
    };
    
    handleEmailChange(e) {
        window.self.props.authStore.setEmail(e.target.value);
    };
    
    handlePasswordChange(e) {
        window.self.props.authStore.setPassword(e.target.value)
    };
    
    handleSubmitForm(e) {
        e.preventDefault();
        window.self.props.authStore.login()
            .then(() => console.log('logged in'));
    };
    
    render() {
        const {values, errors, inProgress} = window.self.props.authStore;
        return (
            <Grid className={'form'} container item direction='column' alignItems={'stretch'} justify='space-around'>
                <Grid item>
                    <ButtonRadius color='secondary'> Connect with google </ButtonRadius>
                </Grid>
                <Typography style={{fontSize:'1rem', fontWeight: '500'}}> or </Typography>
                <Grid item >
                    <Input
                        label="Email"
                        type="email"
                        autoComplete="email"
                        margin="normal"
                        fullWidth
                        value={values.email}
                        onChange={window.self.handleEmailChange}
                    />
                </Grid>
                <Grid item >
                    <Input
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        margin="normal"
                        fullWidth
                        value={values.password}
                        onChange={window.self.handlePasswordChange}
                    />
                </Grid>
                <Grid item >
                    <ButtonRadius onClick={window.self.handleSubmitForm} color="primary">Log In</ButtonRadius>
                </Grid>
            </Grid>
        )
    };
}));

export default Login;
