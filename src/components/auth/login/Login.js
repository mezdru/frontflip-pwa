import React from 'react';
import {inject, observer} from 'mobx-react';
import {Button, Grid, TextField, Typography} from '@material-ui/core';
import GoogleButton from "../../utils/buttons/GoogleButton";
import CircularProgress from '@material-ui/core/CircularProgress';
import {FormattedMessage, injectIntl} from 'react-intl';
import SnackbarCustom from '../../utils/snackbars/SnackbarCustom';
import { Link, Redirect } from 'react-router-dom';

class Login extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            value: 0,
            successLogin: false,
            redirectTo: null,
            loginErrors: null,
            locale: this.props.commonStore.getCookie('locale') || this.props.commonStore.locale,
            isAuth: this.props.authStore.isAuth()
        };
    }

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
                if (response === 200) {
                    this.setState({successLogin: true, redirectTo: '/' + this.state.locale + (this.props.organisationStore.values.orgTag ? '/'+this.props.organisationStore.values.orgTag : '')});
                } else {
                    this.setState({loginErrors: this.props.intl.formatMessage({id: 'signin.error.generic'})});
                }
            }).catch((err) => {
                // Err can have 3 forms : User has no password. || Wrong password. || User does not exists.
                let errorMessage;
                if (err.status === 404) {
                    errorMessage = this.props.intl.formatMessage({id: 'signin.error.unknown'});
                } else if (err.status === 403) {
                    if (err.response.body.error_description === 'Wrong password.') {
                        errorMessage = this.props.intl.formatMessage({id: 'signin.error.wrongPassword'}, {forgotPasswordLink: '/' + this.state.locale + '/password/forgot'});
                    } else if (err.response.body.error_description === 'User use Google Auth.') {
                        errorMessage = this.props.intl.formatMessage({id: 'signin.error.useGoogle'});
                    } else {
                        errorMessage = this.props.intl.formatMessage({id: 'signin.error.noPassword'}, {forgotPasswordLink: '/' + this.state.locale + '/password/forgot'});
                    }
                }
                if (!errorMessage) errorMessage = this.props.intl.formatMessage({id: 'signin.error.generic'});
                this.setState({loginErrors: errorMessage});
            });
    };
    
    render() {
        const {values, inProgress} = this.props.authStore;
        const {organisation} = this.props.organisationStore.values;
        let {loginErrors, locale, redirectTo, isAuth} = this.state;
        let intl = this.props.intl;

        if (redirectTo) return <Redirect to={redirectTo}/>;
        if (isAuth) return <Redirect to={'/'+locale+(this.props.organisationStore.values.orgTag ? '/'+this.props.organisationStore.values.orgTag : '')}/>;
        
        return (
            <form onSubmit={this.handleSubmitForm}>
                <Grid container item direction='column' spacing={16}>
                    {loginErrors && (
                        <Grid item>
                            <SnackbarCustom variant="warning" message={loginErrors}/>
                        </Grid>
                    )}
                    <Grid item>
                        <GoogleButton fullWidth={true} onClick={this.props.handleGoogleAuth}/>
                    </Grid>
                    <Grid item>
                        <Typography style={{
                            fontSize: '1rem',
                            color: '#7c7c7c',
                            textAlign: 'center'
                        }}><FormattedMessage id="or"/></Typography>
                    </Grid>
                    <Grid item>
                        <TextField
                            label="Email"
                            type="email"
                            autoComplete="email"
                            fullWidth
                            variant={"outlined"}
                            value={values.email}
                            onChange={this.handleEmailChange}
                            required
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            label={intl.formatMessage({id: 'Password'})}
                            type="password"
                            autoComplete="current-password"
                            fullWidth
                            variant={"outlined"}
                            value={values.password}
                            onChange={this.handlePasswordChange}
                            required
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
                                <Button fullWidth={true} color="primary" type="submit"><FormattedMessage id="Sign In"/></Button>
                            )
                        }
                    </Grid>
                    <Grid item container justify="center">
                        <Grid item>
                            <Button component={ Link } 
                                    to={"/" + locale + ( (organisation && organisation.tag) ? '/'+organisation.tag:'') + "/password/forgot"} 
                                    variant="text"
                            >
                                <FormattedMessage id="I don't have my password"/>
                            </Button>
                        </Grid>
                        
                    </Grid>
                </Grid>
            </form>
        )
    };
}

export default inject('authStore', 'userStore', 'organisationStore', 'commonStore')(
    injectIntl(observer(
        (Login)
    ))
);
