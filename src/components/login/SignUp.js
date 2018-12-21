import React from 'react';
import {inject, observer} from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import SnackbarCustom from '../utils/snackbars/SnackbarCustom';
import Input from '../utils/inputs/InputWithRadius'
import ButtonRadius from '../utils/buttons/ButtonRadius';


import './LoginSignup.css';
import {Typography} from "@material-ui/core";

let SignUp = inject("authStore", "organisationStore")(observer(class SignUp extends React.Component {
    
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
    }
    
    handleEmailChange = (e) => {
        console.log('signup func');
        this.props.authStore.setEmail(e.target.value);
    };
    
    handlePasswordChange = (e) => {
        console.log('signup func');
        this.props.authStore.setPassword(e.target.value)
    };
    
    handleSubmitForm = (e) => {
        this.props.authStore.register()
        .then(() => {
            if(this.props.organisationStore.values.orgTag){
                console.log('register to org');
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
            this.setState({registerErrors: err.message})
        })
    };
    
    render() {
        const {values, errors, inProgress} = this.props.authStore;
        let {registerErrors, registerSuccess, registerSuccessMessage} = this.state;

        if(registerSuccess){
            return (
                <Grid className={'form'} container item direction='column' justify='space-between' alignItems="stretch">
                    <Grid item>
                            <SnackbarCustom variant="info"
                                            message={registerSuccessMessage}/>
                    </Grid>
                </Grid>
            )
        }else{
            return (
                <Grid className={'form'} container item direction='column' justify='space-between' alignItems="stretch">
                    {registerErrors && (
                        <Grid item>
                            <SnackbarCustom variant="error"
                                            message={registerErrors}/>
                        </Grid>
                    )}
                    
                    <Grid item>
                        <ButtonRadius style={{backgroundColor: 'white', position: 'relative'}}>
                            <img src="https://developers.google.com/identity/images/g-logo.png" style={{width: '25px', height: '25px', position: 'absolute', left: '7px'}} alt="google"/>
                            <Typography> connect with google</Typography>
                        </ButtonRadius>
                    </Grid>
                    <Typography style={{fontSize: '1rem', fontWeight: '500'}}> or </Typography>
                    <Grid item>
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
                    <Grid item>
                        <Input
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            margin="normal"
                            fullWidth
                            value={values.password}
                            onChange={this.handlePasswordChange}
                        />
                    </Grid>
                    <Grid item>
                        <ButtonRadius onClick={this.handleSubmitForm} color="primary"> Sign Up </ButtonRadius>
                    </Grid>
                </Grid>
            )
        }
        

    };
}));

export default SignUp
