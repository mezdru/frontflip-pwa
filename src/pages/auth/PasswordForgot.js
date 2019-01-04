import React from 'react';
import {inject, observer} from 'mobx-react';
import {Button, Grid, Paper, TextField, withStyles} from "@material-ui/core";
import {InfoOutlined, ErrorOutline} from '@material-ui/icons';
import {FormattedMessage, FormattedHTMLMessage, injectIntl} from 'react-intl';

import mdpImg from '../../resources/images/birdFly.png';

const styles = {
    image: {
        width: '12rem',
        padding: '1rem'
    }
};

class PasswordForgot extends React.Component {
    
    constructor() {
        super();
        this.state = {
            successPasswordReset: false,
            emailError: null
        }
    }
    
    componentWillUnmount = () => {
        this.props.authStore.reset();
    };
    
    handleEmailChange = (e) => {
        this.props.authStore.setEmail(e.target.value);
    };
    
    handleSubmitForm = (e) => {
        e.preventDefault();
        this.props.authStore.passwordForgot()
            .then(response => {
                this.setState({successPasswordReset: true});
            }).catch(err => {
                this.setState({emailError: this.props.intl.formatMessage({id: 'signin.error.unknown'})});
                this.setState({successPasswordReset: false});
            });
    };
    
    render() {
        let {values} = this.props.authStore;
        let {successPasswordReset, emailError} = this.state;
        
        if (successPasswordReset) {
            return (
                <Grid container item xs={12} sm={6} lg={4} spacing={16}>
                    <Grid item container justify={"center"}>
                        <Paper><InfoOutlined/> <br/><FormattedHTMLMessage id="password.forgot.success"/></Paper>
                    </Grid>
                </Grid>
            );
        } else {
            return (
                <Grid container item xs={12} sm={6} lg={4} spacing={16}>
                    <Grid item container justify={"center"} alignItems={"center"}>
                        <img src={mdpImg} alt="mdp" className={this.props.classes.image}/>
                    </Grid>
                    <Grid item container justify={"center"}>
                        <p><FormattedHTMLMessage id="password.forgot.intro"/></p>
                        {emailError && (
                            <Paper>
                                <ErrorOutline/> <br/>
                                <span dangerouslySetInnerHTML={{__html: emailError}}></span>
                            </Paper>
                        )}
                    </Grid>
                    <Grid item container direction={"column"} justify={"center"}>
                        <form onSubmit={this.handleSubmitForm}>
                            <Grid item container direction={"column"} spacing={16}>
                                <Grid item style={{height: '88px'}}>
                                    <TextField label="Email"
                                               type="email"
                                               autoComplete="email"
                                               margin="normal"
                                               variant={"outlined"}
                                               fullWidth={true}
                                               onChange={this.handleEmailChange}
                                    />
                                </Grid>
                                <Grid item>
                                    <Button fullWidth={true} type="submit" color="primary"><FormattedMessage id="Reset your password"/></Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            );
        }
    }
}

export default inject('authStore')(
    injectIntl(
        observer(
            withStyles(styles)
            (PasswordForgot)
        )
    )
);
