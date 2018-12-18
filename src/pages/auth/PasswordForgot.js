import React from 'react'
import {inject, observer} from 'mobx-react';
import SnackbarCustom from '../../components/utils/snackbars/SnackbarCustom';
import Input from '../../components/utils/inputs/InputWithRadius'
import ButtonRadius from '../../components/utils/buttons/ButtonRadius';
import Grid from '@material-ui/core/Grid';

import './Auth.css';

let PasswordForgot = inject("authStore")(observer(class PasswordForgot extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            successPasswordReset: false
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
                if (response) {
                    this.setState({successPasswordReset: true});
                }
            }).catch(err => {
            // nothing
        });
    };
    
    render() {
        const {values} = this.props.authStore;
        let {successPasswordReset} = this.state;
        
        if (successPasswordReset) {
            return <SnackbarCustom variant="info"
                                   message="If you have an account on Wingzy, we have send you an email to reset your password."/>;
        } else {
            return (
                <Grid container justify={"center"} className={"margin-form"}>
                    <Grid item container justify={"center"} alignItems={"center"} xs={12} sm={4}>
                        You forgot your password ? Don't worry ! You can ask for a reset :
                        <Input label="Email"
                               type="email"
                               autoComplete="email"
                               margin="normal"
                               value={values.email}
                               onChange={this.handleEmailChange}/>
                        <ButtonRadius onClick={this.handleSubmitForm} color="primary">Reset your password</ButtonRadius>
                    </Grid>
                </Grid>
            );
        }
    }
}));

export default PasswordForgot;
