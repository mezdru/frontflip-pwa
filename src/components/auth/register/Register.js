import React from 'react';
import {inject, observer} from 'mobx-react';
import {Button, Grid, TextField, Typography} from "@material-ui/core";

import GoogleButton from "../../utils/buttons/GoogleButton";
import {FormattedMessage, injectIntl} from 'react-intl';
import CircularProgress from '@material-ui/core/CircularProgress';
import UrlService from '../../../services/url.service';
import SnackbarCustom from '../../utils/snackbars/SnackbarCustom';
import commonStore from '../../../stores/common.store';

class Register extends React.Component {
    
    constructor() {
        super();
        
        this.state = {
            value: 0,
            registerErrors: null,
            registerSuccess: false,
            registerSuccessMessage: '',
            locale: commonStore.locale || commonStore.getCookie('locale')
        };
    }
    
    // componentWillMount = () => {
    //     this.props.authStore.reset();
    // };
    
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
                if (this.props.organisationStore.values.orgTag) {
                    this.props.authStore.registerToOrg()
                        .then(() => {
                            this.setState({registerSuccess: true});
                            this.setState({registerSuccessMessage: this.props.intl.formatMessage({id: 'signup.success'})});
                        }).catch((err) => {
                            this.setState({registerSuccess: true});
                            this.setState({registerSuccessMessage: this.props.intl.formatMessage({id: 'signup.warning.forbiddenOrg'}, {orgName: this.props.organisationStore.values.organisation.name})});
                        });
                } else {
                    this.setState({registerSuccessMessage: this.props.intl.formatMessage({id: 'signup.success'})});
                    this.setState({registerSuccess: true});
                }
            }).catch((err) => {
                let errorMessage;
                if (err.status === 422) {
                    err.response.body.errors.forEach(error => {
                        if (error.param === 'password') {
                            if (error.type === 'dumb') {
                                // (frequency over 100 000 passwords, 3 000 000 000 people use internet, 30 000 = 3 000 000 000 / 100 000)
                                errorMessage = (errorMessage ? errorMessage + '<br/>' : '') + this.props.intl.formatMessage({id: 'signup.error.dumbPassword'}, {dumbCount: (parseInt(error.msg) * 30000).toLocaleString()});
                            } else {
                                errorMessage = (errorMessage ? errorMessage + '<br/>' : '') + this.props.intl.formatMessage({id: 'signup.error.shortPassword'});
                            }
                        } else if (error.param === 'email') {
                            errorMessage = (errorMessage ? errorMessage + '<br/>' : '') + this.props.intl.formatMessage({id: 'signup.error.wrongEmail'});
                        }
                    });
                }else if(err.status === 400 && err.response.body.message === 'User already exists.'){
                    errorMessage = this.props.intl.formatMessage({id: 'signup.error.userExists'}, {forgotPasswordLink: '/' + this.state.locale + '/password/forgot'});
                }
                if (!errorMessage) errorMessage = this.props.intl.formatMessage({id: 'signup.error.generic'});
                this.setState({registerErrors: errorMessage});
            });
    };
    
    handleGoogleConnect = (e) => {
        if(this.props.organisationStore.values.orgTag && this.props.authStore.values.invitationCode) {
            window.location.href = UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/google/login', this.props.organisationStore.values.orgTag) + 
                (UrlService.env === 'production' ? '?' : '&') + 'code=' + this.props.authStore.values.invitationCode;
        } else {
            window.location.href = UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/google/login', this.props.organisationStore.values.orgTag);
        }    
    };
    
    render() {
        const {values, inProgress} = this.props.authStore;
        let {registerErrors, registerSuccess, registerSuccessMessage} = this.state;
        let intl = this.props.intl;
        
        if (registerSuccess) {
            return (
                <Grid className={'form'} container item direction='column' spacing={16}>
                    <Grid item>
                        <SnackbarCustom variant="success" message={registerSuccessMessage}/>
                    </Grid>
                </Grid>
            )
        } else {
            return (
                <form onSubmit={this.handleSubmitForm}>
                    <Grid className={'form'} container item direction='column' spacing={16}>
                        {registerErrors && (
                            <Grid item>
                                <SnackbarCustom variant="warning" message={registerErrors}/>
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
                                required
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

export default inject('authStore', 'userStore', 'organisationStore', 'commonStore')(
    injectIntl(observer(
        Register
    ))
);
