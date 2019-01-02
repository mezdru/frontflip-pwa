import React from 'react';
import {inject, observer} from 'mobx-react';
import {Button, Grid, Paper, TextField, Typography} from '@material-ui/core';
import GoogleButton from "../../utils/buttons/GoogleButton";
import {ErrorOutline} from '@material-ui/icons';
import CircularProgress from '@material-ui/core/CircularProgress';
import {FormattedMessage, injectIntl} from 'react-intl';

// const styles = theme => ({
//     root: {
//         "&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
//             borderColor: 'darkgrey'
//         }
//     },
//     disabled: {},
//     focused: {},
//     error: {},
//     notchedOutline: {}
// });

class Login extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            value: 0,
            successLogin: false,
            redirectTo: '/',
            loginErrors: null,
            locale: this.props.commonStore.getCookie('locale') || this.props.commonStore.locale
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
                if (response === 200) {
                    this.setState({successLogin: true});
                    if (process.env.NODE_ENV === 'production') {
                        window.location = 'https://' + (this.props.organisationStore.values.orgTag ? this.props.organisationStore.values.orgTag + '.' : '') + process.env.REACT_APP_HOST_BACKFLIP + '/'+this.state.locale +'/login/callback';
                    } else {
                        window.location = 'http://' + process.env.REACT_APP_HOST_BACKFLIP +'/'+this.state.locale+ '/login/callback' + (this.props.organisationStore.values.orgTag ? '?subdomains=' + this.props.organisationStore.values.orgTag : '');
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
                    this.setState({loginErrors: "We don't know anyone with these credentials. Please check them or ask for a password."});
                    
                }
            }).catch((err) => {
            this.setState({loginErrors: "We don't know anyone with these credentials. Please check them or ask for a password."});
        });
    };
    
    handleGoogleConnect = (e) => {
        if (process.env.NODE_ENV === 'production') {
            window.location = 'https://' + (this.props.organisationStore.values.orgTag ? this.props.organisationStore.values.orgTag + '.' : '') + process.env.REACT_APP_HOST_BACKFLIP + '/'+this.state.locale +'/google/login';
        } else {
            window.location = 'http://' + process.env.REACT_APP_HOST_BACKFLIP +'/'+this.state.locale+ '/google/login' + (this.props.organisationStore.values.orgTag ? '?subdomains=' + this.props.organisationStore.values.orgTag : '');
        }
    };
    
    render() {
        const {values, inProgress} = this.props.authStore;
        let {loginErrors} = this.state;
        let intl = this.props.intl;
        // if (successLogin) return <Redirect to={redirectTo}/>;
        
        
        return (
            <form onSubmit={this.handleSubmitForm}>
                <Grid container item direction='column' spacing={16}>
                    {loginErrors && (
                        <Grid item>
                            <Paper>
                                <ErrorOutline/> <br/>{loginErrors}
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
                            fullWidth
                            variant={"outlined"}
                            value={values.email}
                            onChange={this.handleEmailChange}
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
                                <Button fullWidth={true}  color="primary" type="submit"><FormattedMessage id="Sign In"/></Button>
                            )
                        }
                    </Grid>
                    <Grid item>
                        <Button variant={"text"} href="/password/forgot">
                            <FormattedMessage id="I don't have my password"/>
                        </Button>
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
