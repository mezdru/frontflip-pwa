import React from 'react'
import {inject, observer} from 'mobx-react';
import {Link} from 'react-router-dom'
import {Button, Grid, Paper, TextField, withStyles} from "@material-ui/core";
import {ErrorOutline, InfoOutlined} from '@material-ui/icons';
import {FormattedMessage, injectIntl, FormattedHTMLMessage} from 'react-intl';
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
        this.props.authStore.updatePassword(this.props.match.params.token, this.props.match.params.hash)
            .then(response => {
                    window.location.href = UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/login/callback', this.props.organisationStore.values.orgTag);
            }).catch(err => {
                let errorMessage;
                if(err.status === 422){
                    err.response.body.errors.forEach(error => {
                        if(error.param === 'password') {
                            if(error.type === 'dumb'){
                                // (frequency over 100 000 passwords, 3 000 000 000 people use internet, 30 000 = 3 000 000 000 / 100 000)
                                errorMessage = (errorMessage ? errorMessage + '<br/>': '') + this.props.intl.formatMessage({id: 'signup.error.dumbPassword'}, {dumbCount: (parseInt(error.msg)*30000).toLocaleString()});
                            }else{
                                errorMessage = (errorMessage ? errorMessage + '<br/>': '') + this.props.intl.formatMessage({id: 'signup.error.shortPassword'});
                            }
                        }
                    });
                }

                if(!errorMessage) this.props.intl({id: 'signup.error.generic'});
                this.setState({passwordErrors: errorMessage});
            });
    };
    
    render() {
        const {values} = this.props.authStore;
        let {passwordErrors} = this.state;
        let intl = this.props.intl;
        
            return (
                <Grid container direction={"column"} justify={"center"} alignItems={"center"} xs={12} sm={4} spacing={16}>
                    <Grid container item justify={"center"}>
                        <FormattedHTMLMessage id="password.new.intro" values={{userEmail: values.email}}/>
                        {passwordErrors && (
                            <Paper>
                                <ErrorOutline/> <br/>
                                <span dangerouslySetInnerHTML={{__html: passwordErrors}}></span>
                            </Paper>
                        )}
                    </Grid>
                    <Grid item container direction={"column"} justify={"center"}>
                        <form onSubmit={this.handleSubmitForm}>
                            <Grid item container direction={"column"} spacing={16}>
                                <Grid item style={{height: '88px'}}>
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
                                    <Button fullWidth={true} type="submit" color="primary"><FormattedMessage id="Change password"/></Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            );        
    }
}

export default inject("authStore", "organisationStore", "commonStore")(
    injectIntl(
        observer(
            withStyles(styles)(PasswordReset)
        )
    )
)
