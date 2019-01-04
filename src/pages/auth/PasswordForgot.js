import React from 'react';
import {inject, observer} from 'mobx-react';
import {Button, Grid, Paper, TextField, withStyles} from "@material-ui/core";
import {InfoOutlined} from '@material-ui/icons';
import {FormattedMessage} from 'react-intl';

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
        let {values} = this.props.authStore;
        let {successPasswordReset} = this.state;
        
        if (successPasswordReset) {
            return <Paper><InfoOutlined/> <br/>If you have an account on Wingzy, we have send you an email to reset your password.</Paper>;
        } else {
            return (
                <Grid container item xs={12} sm={6} lg={4} spacing={16}>
                    <Grid item container justify={"center"} alignItems={"center"}>
                        <img src={mdpImg} alt="mdp" className={this.props.classes.image}/>
                    </Grid>
                    <Grid item container justify={"center"}>
                        <p><FormattedMessage id="You forgot your password or didn't have one yet ? Don't worry ! You can ask for a reset"/></p>
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
    observer(
        withStyles(styles)
        (PasswordForgot)
    )
);
