import React from 'react'
import {inject, observer} from 'mobx-react';
import {Button, Grid, TextField, Typography, withStyles} from "@material-ui/core";
import {FormattedHTMLMessage, FormattedMessage, injectIntl} from 'react-intl';
import UrlService from '../../services/url.service';
import CircularProgress from '@material-ui/core/CircularProgress';
import Banner from '../../components/utils/banner/Banner';
import Logo from '../../components/utils/logo/Logo';
import SnackbarCustom from '../../components/utils/snackbars/SnackbarCustom';

const styles = {
    logo: {
        width: '6rem',
        height: '6rem',
        boxShadow: '0 5px 15px -1px darkgrey, 0 0 0 5px transparent',
        bottom: '3rem',
        marginBottom: '-6rem',
        zIndex:2,
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

    componentDidMount() {
        if(this.props.match && this.props.match.params && this.props.match.params.organisationTag) {
            this.props.organisationStore.setOrgTag(this.props.match.params.organisationTag);
            this.props.organisationStore.getOrganisationForPublic();
        }
    }
    
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
                if (err.status === 422) {
                    err.response.body.errors.forEach(error => {
                        if (error.param === 'password') {
                            if (error.type === 'dumb') {
                                // (frequency over 100 000 passwords, 3 000 000 000 people use internet, 30 000 = 3 000 000 000 / 100 000)
                                errorMessage = (errorMessage ? errorMessage + '<br/>' : '') + this.props.intl.formatMessage({id: 'signup.error.dumbPassword'}, {dumbCount: (parseInt(error.msg) * 30000).toLocaleString()});
                            } else {
                                errorMessage = (errorMessage ? errorMessage + '<br/>' : '') + this.props.intl.formatMessage({id: 'signup.error.shortPassword'});
                            }
                        }
                    });
                }
                if (!errorMessage) this.props.intl.formatMessage({id: 'signup.error.generic'});
                this.setState({passwordErrors: errorMessage});
            });
    };
    
    render() {
        const {values, inProgress} = this.props.authStore;
        let {passwordErrors} = this.state;
        let intl = this.props.intl;
        
        return (
            <Grid container direction={"column"} justify={"space-around"}>
                <Grid container item alignItems={"stretch"}>
                    <Banner/>
                </Grid>
                <Grid container item justify={"center"}>
                    <Logo type={"organisation"} alt="org-logo" className={this.props.classes.logo}/>
                </Grid>
                <form onSubmit={this.handleSubmitForm}>
                    <Grid item container direction={'column'} xs={12} sm={6} lg={4} spacing={16}>
                        <Typography variant="h6"><FormattedHTMLMessage id="password.new.intro" values={{userEmail: values.email}}/></Typography>
                        {passwordErrors && (
                            <SnackbarCustom variant='warning' message={passwordErrors}/>
                        )}
                        <Grid item>
                            <TextField
                                label={intl.formatMessage({id: 'Password'})}
                                type="password"
                                fullWidth
                                variant={"outlined"}
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
                                    <Button fullWidth={true} type="submit" color="primary"><FormattedMessage id="password.new.create"/></Button>
                                )
                            }
                        </Grid>
                    </Grid>
                </form>
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
