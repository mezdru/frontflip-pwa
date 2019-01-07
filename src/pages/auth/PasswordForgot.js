import React from 'react';
import {inject, observer} from 'mobx-react';
import {Avatar, Button, Grid, TextField, Typography, withStyles} from "@material-ui/core";
import {FormattedHTMLMessage, FormattedMessage, injectIntl} from 'react-intl';

import Banner from '../../components/utils/banner/Banner';
import bannerImg from '../../resources/images/fly_away.jpg';
import SnackbarCustom from '../../components/utils/snackbars/SnackbarCustom';

const styles = {
    avatar: {
        bottom: '4rem',
        marginBottom: '-4rem'
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
        let {intl} = this.props;
        
        if (successPasswordReset) {
            return (
                <Grid container item xs={12} sm={6} lg={4} spacing={16}>
                    <Grid item container justify={"center"}>
                        <SnackbarCustom variant="success" message={intl.formatMessage({id: 'password.forgot.success'})}/>
                    </Grid>
                </Grid>
            );
        } else {
            return (
                <Grid container direction={"column"} justify={"space-around"}>
                    <Grid container item alignItems={"stretch"}>
                        <Banner src={bannerImg}/>
                    </Grid>
                    <Grid container item justify={"center"}>
                        <Avatar src={'https://pbs.twimg.com/profile_images/981455890342694912/fXaclV2Y_400x400.jpg'} alt="org-logo" className={this.props.classes.avatar}/>
                    </Grid>
                    <form onSubmit={this.handleSubmitForm}>
                        <Grid item container direction={'column'} xs={12} sm={6} lg={4} spacing={16}>
                            <Typography variant="h6"><FormattedHTMLMessage id="password.forgot.intro"/></Typography>
                            {emailError && (
                                <Grid item>
                                    <SnackbarCustom variant="warning" message={emailError}/>
                                </Grid>
                            )}
                            <Grid item>
                                <TextField label="Email"
                                           type="email"
                                           autoComplete="email"
                                           variant={"outlined"}
                                           fullWidth={true}
                                           onChange={this.handleEmailChange}
                                           required
                                />
                            </Grid>
                            <Grid item>
                                <Button fullWidth={true} type="submit" color="primary"><FormattedMessage id="password.forgot.send"/></Button>
                            </Grid>
                        </Grid>
                    </form>
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
