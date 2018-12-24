import React from 'react'
import {inject, observer} from 'mobx-react';
import {Link} from 'react-router-dom'
import SnackbarCustom from '../../components/utils/snackbars/SnackbarCustom';
import {TextField, Button, Grid, Paper} from "@material-ui/core";
import { ErrorOutline, InfoOutlined } from '@material-ui/icons';

class PasswordReset extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            passwordErrors: null,
            successUpdatePassword: false
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
                    if (process.env.NODE_ENV === 'production') {
                        window.location = 'https://' + (this.props.organisationStore.values.orgTag ? this.props.organisationStore.values.orgTag + '.' : '') + process.env.REACT_APP_HOST_BACKFLIP + '/login/callback';
                    } else {
                        window.location = 'http://' + process.env.REACT_APP_HOST_BACKFLIP + '/login/callback' + (this.props.organisationStore.values.orgTag ? '?subdomains=' + this.props.organisationStore.values.orgTag : '');
                    }
                } else {
                    this.setState({passwordErrors: response.body.errors[0].msg});
                }
            }).catch(err => {
            console.log(err)
        });
    }
    
    render() {
        const {values} = this.props.authStore;
        let {passwordErrors, successUpdatePassword} = this.state;
        
        if (successUpdatePassword) {
            return (
                <div>
                    <Paper elevation="1">
                        <InfoOutlined/>  Your password have been updated.
                        Go to : <Link to="/">Login page</Link>
                    </Paper>
                </div>
            );
        } else {
            return (
                <Grid container direction={"column"} justify={"center"} alignItems={"center"} className={"margin-form"} xs={12} sm={4} spacing={16}>
                    <Grid container item justify={"center"}>
                        You can now choose a new password
                        {passwordErrors && (
                            <Paper>
                                <ErrorOutline/>  {passwordErrors}
                            </Paper>
                        )}
                    </Grid>
                    <Grid container item>
                        <TextField
                            label="Password"
                            type="password"
                            margin="normal"
                            fullWidth
                            variant={"outlined"}
                            value={values.password}
                            onChange={this.handlePasswordChange}
                        />
                    </Grid>
                    <Grid container item>
                        <Button fullWidth={true} onClick={this.handleSubmitForm} color="primary">Change password</Button>
                    </Grid>
                </Grid>
            );
        }
        
        
    }
}

export default inject("authStore")(
    observer(PasswordReset)
);
