import React from 'react';
import {inject, observer} from 'mobx-react';
import {Redirect} from "react-router-dom";
import {Grid, Typography} from '@material-ui/core';
import Input from '../utils/inputs/InputWithRadius'
import './LoginSignup.css';
import ButtonRadius from '../utils/buttons/ButtonRadius';
import SnackbarCustom from '../utils/snackbars/SnackbarCustom';
import { Link } from 'react-router-dom'

let Login = inject("authStore", "userStore", "organisationStore")(observer(class Login extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            successLogin: false,
            redirectTo: '/',
            loginErrors: null
        };
    }
    
    componentWillUnmount = () => {
        this.props.authStore.reset();
    };
    
    handleEmailChange = (e) => {
        this.props.authStore.setEmail(e.target.value);
    };
    
    handlePasswordChange = (e) => {
        this.props.authStore.setPassword(e.target.value)
    };
    
    handleSubmitForm = (e) => {
        e.preventDefault();
        this.props.authStore.login()
            .then((response) => {
                if(response === 200){
                    this.setState({successLogin: true});
                    if(process.env.NODE_ENV === 'production'){
                        window.location = 'https://' + (this.props.organisationStore.values.orgTag ? this.props.organisationStore.values.orgTag + '.' : '') + process.env.REACT_APP_HOST_BACKFLIP + '/login/callback';
                    }else{
                        window.location = 'http://' + process.env.REACT_APP_HOST_BACKFLIP +'/login/callback' +(this.props.organisationStore.values.orgTag ? '?subdomains=' +this.props.organisationStore.values.orgTag : '');
                    }
                    // if(this.props.userStore.values.currentUser.orgsAndRecords.length > 0 && 
                    //     this.props.userStore.values.currentUser.orgsAndRecords[0].record){
                        
                    //     this.setState({redirectTo: '/profile'});
                    // }else if(this.props.userStore.values.currentUser.orgsAndRecords.length > 0){
                    //     this.setState({redirectTo: '/onboard/profile'});
                    // }else{
                    //     this.setState({redirectTo: '/onboard/wingzy'});
                    // }
                } else {
                    this.setState({loginErrors : response.message});

                }
            }).catch((err)=>{
                this.setState({loginErrors : err.message});
            });
    };
    
    render() {
        const {values, errors, inProgress} = this.props.authStore;
        let {successLogin, loginErrors, redirectTo} = this.state;
        // if (successLogin) return <Redirect to={redirectTo}/>;

        return (
            <Grid className={'form'} container item direction='column' alignItems={'stretch'} justify='space-between'>
                {loginErrors && (
                    <Grid item >
                        <SnackbarCustom variant="error"
                                        message={loginErrors} />
                    </Grid>
                )}
                
                <Grid item >
                    <ButtonRadius style={{backgroundColor:'white', position:'relative'}}>
                        <img src="https://developers.google.com/identity/images/g-logo.png" style={{width:'25px', height: '25px', position:'absolute', left: '7px'}} alt="google"/>
                        <Typography> connect with google</Typography>
                    </ButtonRadius>
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
                        onChange={this.handleEmailChange}
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
                        onChange={this.handlePasswordChange}
                    />
                    <Link to="/password/forgot">I forgot my password</Link>
                </Grid>
                <Grid item >
                    <ButtonRadius onClick={this.handleSubmitForm} color="primary">Log In</ButtonRadius>
                </Grid>
            </Grid>
        )
    };
}));

export default Login;
