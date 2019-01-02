import React from 'react'
import {inject, observer} from 'mobx-react';
import {Link} from 'react-router-dom'
import {Button, Grid, Paper, TextField, withStyles} from "@material-ui/core";
import {ErrorOutline, InfoOutlined} from '@material-ui/icons';
import {FormattedMessage, injectIntl} from 'react-intl';
import UrlService from '../../services/url.service';

import mdpImg from '../../resources/images/butterflyCatch.png';

const styles = {
    image: {
        width: '12rem',
        padding: '1rem'
    }
};

class PasswordReset extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            passwordErrors: null,
            successUpdatePassword: false,
            locale: this.props.commonStore.getCookie('locale') || this.props.commonStore.locale
        }
    }
    
    componentWillUnmount = () => {
        this.props.authStore.reset();
    };
    
    handlePasswordChange = (e) => {
        this.props.authStore.setPassword(e.target.value)
    };
    
    handleSubmitForm = (e) => {
        e.preventDefault();
        this.props.authStore.updatePassword(this.props.match.params.token,
            this.props.match.params.hash)
            .then(response => {
                if (!(response.body) || !(response.body.errors)) {
                    this.setState({successUpdatePassword: true});
                    window.location.href = UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/login/callback', this.props.organisationStore.values.orgTag);
                } else {
                    this.setState({passwordErrors: response.body.errors[0].msg});
                }
            }).catch(err => {
            console.log(err)
        });
    };
    
    render() {
        const {values} = this.props.authStore;
        let {passwordErrors, successUpdatePassword} = this.state;
        let intl = this.props.intl;
        
        if (successUpdatePassword) {
            return (
                <div>
                    <Paper>
                        <InfoOutlined/> <br/>Your password have been updated.
                        Go to : <Link to="/">Login page</Link>
                    </Paper>
                </div>
            );
        } else {
            return (
                <Grid container direction={"column"} justify={"center"} alignItems={"center"} className={"margin-form"} xs={12} sm={4} spacing={16}>
                    <Grid item container justify={"center"} alignItems={"center"}>
                        <img src={mdpImg} alt="mdp" className={this.props.classes.image}/>
                    </Grid>
                    <Grid container item justify={"center"}>
                        <FormattedMessage id="You can now choose a new password"/>
                        {passwordErrors && (
                            <Paper>
                                <ErrorOutline/> <br/>{passwordErrors}
                            </Paper>
                        )}
                    </Grid>
                    <Grid container item>
                        <TextField
                            label={intl.formatMessage({id: 'Password'})}
                            type="password"
                            margin="normal"
                            fullWidth
                            variant={"outlined"}
                            onChange={this.handlePasswordChange}
                        />
                    </Grid>
                    <Grid container item>
                        <Button fullWidth={true} onClick={this.handleSubmitForm} color="primary"><FormattedMessage id="Change password"/></Button>
                    </Grid>
                </Grid>
            );
        }
        
        
    }
}

export default inject("authStore", "organisationStore", "commonStore")(
    injectIntl(
        observer(
            withStyles(styles)(PasswordReset)
        )
    )
)

