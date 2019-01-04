import React from 'react';
import {inject, observer} from 'mobx-react';
import {Typography, TextField, Grid, Button, Paper} from "@material-ui/core";

import GoogleButton from "../../utils/buttons/GoogleButton";
import { ErrorOutline, InfoOutlined } from '@material-ui/icons';
import {injectIntl, FormattedMessage} from 'react-intl';
import CircularProgress from '@material-ui/core/CircularProgress';
import UrlService from '../../../services/url.service';

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
        e.preventDefault();
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
        });
    };
    
    handleGoogleConnect = (e) => {
        window.location.href = UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/google/login', this.props.organisationStore.values.orgTag);
    };
    
    render() {
        const {values, inProgress} = this.props.authStore;
        let {registerErrors, registerSuccess, registerSuccessMessage} = this.state;
        let intl = this.props.intl;
        
        if(registerSuccess){
            return (
                <Grid className={'form'} container item direction='column' spacing={16}>
                    <Grid item>
                        <Paper>
                            <InfoOutlined/>  <br/>{registerSuccessMessage}
                        </Paper>
                    </Grid>
                </Grid>
            )
        }else{
            return (
                <form onSubmit={this.handleSubmitForm} >
                    <Grid className={'form'} container item direction='column' spacing={16}>
                        {registerErrors && (
                            <Grid item>
                                <Paper>
                                    <ErrorOutline/> <br/>{registerErrors}
                                </Paper>
                            </Grid>
                        )}
                        <Grid item>
                            <GoogleButton fullWidth={true} onClick={this.handleGoogleConnect}/>
                        </Grid>
                        <Grid item>
                            <Typography style={{
                                fontSize: '1rem',
                                color: '#7c7c7c'
                            }}><FormattedMessage id="or"/></Typography>
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
                                label={intl.formatMessage({id: 'Password'})}
                                type="password"
                                autoComplete="current-password"
                                variant={"outlined"}
                                fullWidth
                                value={values.password}
                                onChange={this.handlePasswordChange}
                            />
                        </Grid>
                        <Grid item>
                            {
                                inProgress && (
                                    <CircularProgress color="primary"/>
                                )
                            }
                            {
                                !inProgress && (
                                    <Button fullWidth={true} type="submit" color="primary"><FormattedMessage id="Sign Up"/></Button>
                                )
                            }
                        </Grid>
                    </Grid>
                </form>
            )
        }
    };
}

export default inject('authStore', 'userStore', 'organisationStore')(
    injectIntl(observer(
        Register
    ))
);
