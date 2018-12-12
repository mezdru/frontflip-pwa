import React from 'react';
import {inject, observer} from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import SnackbarCustom from '../utils/snackbars/SnackbarCustom';
import Input from '../utils/inputs/InputWithRadius'
import ButtonRadius from '../utils/buttons/ButtonRadius';


import './LoginSignup.css';
import {Typography} from "@material-ui/core";

let SignUp = inject("authStore")(observer(class SignUp extends React.Component {
    
    constructor() {
        super();
        this.state = {
            value: 0,
            registerErrors: null
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
            // send email of confirmation
            // display success screen
        }).catch((err)=>{
            this.setState({registerErrors: err.message})
        })
        // if we want to access an org, we have to create a cookie with the id of the org
    };

    render() {
        const {values, errors, inProgress} = this.props.authStore;
        let {registerErrors} = this.state;

        return (
            <Grid className={'form'} container item direction='column' justify='space-around' alignItems="stretch">
                {registerErrors && (
                    <Grid item >
                        <SnackbarCustom variant="error"
                                        message={registerErrors} />
                    </Grid>
                )}

                <Grid item>
                    <ButtonRadius style={{backgroundColor:'white', position:'relative'}}>
                        <img src="https://developers.google.com/identity/images/g-logo.png" style={{width:'25px', height: '25px', position:'absolute', left: '7px'}} alt="google"/>
                        <Typography> connect with google</Typography>
                    </ButtonRadius>
                </Grid>
                <Typography style={{fontSize:'1rem', fontWeight: '500'}}> or </Typography>
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
    };
}));

export default SignUp
