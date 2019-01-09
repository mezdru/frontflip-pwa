import React from 'react';
import {inject, observer} from 'mobx-react';
import {Button, Grid, TextField, Typography, withStyles} from "@material-ui/core";
import {FormattedHTMLMessage, FormattedMessage, injectIntl} from 'react-intl';
import Banner from '../../components/utils/banner/Banner';
import Logo from '../../components/utils/logo/Logo';
import SnackbarCustom from '../../components/utils/snackbars/SnackbarCustom';

const styles = {
    logo: {
        bottom: '4rem',
        marginBottom: '-4rem'
    }
};

class PasswordForgot extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            successPasswordReset: false,
            emailError: null
        }
    }

    componentDidMount() {
        if(this.props.match && this.props.match.params && this.props.match.params.organisationTag) {
            this.props.organisationStore.setOrgTag(this.props.match.params.organisationTag);
            this.props.organisationStore.getOrganisationForPublic();
        }
    }

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
        
            return (
                <Grid container direction={"column"} justify={"space-around"}>
                    <Grid container item alignItems={"stretch"}>
                        <Banner/>
                    </Grid>
                    <Grid container item justify={"center"}>
                        <Logo type={"organisation"} alt="org-logo" className={this.props.classes.logo}/>
                    </Grid>
                    {successPasswordReset && (
                        <Grid container item xs={12} sm={6} lg={4} spacing={16}>
                            <Grid item container justify={"center"}>
                                <SnackbarCustom variant="success" message={intl.formatMessage({id: 'password.forgot.success'})}/>
                            </Grid>
                        </Grid>
                    )}

                    {!successPasswordReset && (
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
                    )}

                </Grid>
            );
    }
}

export default inject('authStore', 'organisationStore')(
    injectIntl(
        observer(
            withStyles(styles)
            (PasswordForgot)
        )
    )
);
