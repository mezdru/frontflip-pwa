import React from 'react';
import {inject, observer} from 'mobx-react';
import SnackbarCustom from '../utils/snackbars/SnackbarCustom';
import {Typography, TextField, Grid, Button, Paper} from "@material-ui/core";

import '../login/Login.css';
import GoogleButton from "../utils/buttons/GoogleButton";
import { ErrorOutline, InfoOutlined } from '@material-ui/icons';

class Register extends React.Component {
    
    constructor() {
        super();
        this.state = {
            value: 0,
            registerErrors: null,
            registerSuccess: false,
            registerSuccessMessage: ''
        };
    }
    
    componentWillMount = () => {
        this.props.authStore.reset();
    };
    
    handleEmailChange = (e) => {
        this.props.authStore.setEmail(e.target.value);
    };
    
    handlePasswordChange = (e) => {
        this.props.authStore.setPassword(e.target.value)
    };
    
    handleSubmitForm = (e) => {
        this.props.authStore.register()
            .then(() => {
                if(this.props.organisationStore.values.orgTag){
                    this.props.authStore.registerToOrg()
                    .then(() => {  
                        this.setState({registerSuccess: true});
                        this.setState({registerSuccessMessage: 'To complete your register, we have send you an email. You should confirm your address by clicking this email.'});
                    }).catch((err) => {
                        this.setState({registerSuccess: true});
                        this.setState({registerSuccessMessage: 'You are register to Wingzy but can\'t access the Wingzy of ' + this.props.organisationStore.values.orgTag + '. Please confirm your email address to continue.'});
                    })
                }else{
                    this.setState({registerSuccessMessage: 'To complete your register, we have send you an email. You should confirm your address by clicking this email.'});
                    this.setState({registerSuccess: true});
                }
            }).catch((err) => {
            this.setState({registerErrors: 'There was an error. You probably already have an account on Wingzy.'});
        })
    };
    
    render() {
        const {values, errors, inProgress} = this.props.authStore;
        let {registerErrors, registerSuccess, registerSuccessMessage} = this.state;

        if(registerSuccess){
            return (
                <Grid className={'form'} container item direction='column' spacing={16}>
                    <Grid item>
                        <Paper elevation="1">
                            <InfoOutlined/>  <br/>{registerSuccessMessage}
                        </Paper>
                    </Grid>
                </Grid>
            )
        }else{
        return (
            <Grid className={'form'} container item direction='column' spacing={16}>
                {registerErrors && (
                    <Grid item>
                        <Paper elevation="1">
                        <ErrorOutline/>  <br/>{registerErrors}
                        </Paper>
                    </Grid>
                )}
                <Grid item>
                    <GoogleButton fullWidth={true}/>
                </Grid>
                <Grid item>
                    <Typography className="or-seperator"> or </Typography>
                </Grid>
                <Grid item>
                    <TextField
                        label="Email"
                        type="email"
                        autoComplete="email"
                        variant={"outlined"}
                        fullWidth
                        value={values.email}
                        onChange={this.handleEmailChange}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        variant={"outlined"}
                        fullWidth
                        value={values.password}
                        onChange={this.handlePasswordChange}
                    />
                </Grid>
                <Grid item>
                    <Button fullWidth={true} onClick={this.handleSubmitForm} color="primary">Sign Up</Button>
                </Grid>
            </Grid>
        )
    }
    };
}

export default inject('authStore', 'userStore', 'organisationStore')(
    observer(
        Register
    )
);
