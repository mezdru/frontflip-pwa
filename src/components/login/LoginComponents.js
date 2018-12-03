import React from 'react';
import {inject, observer} from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import {withStyles} from '@material-ui/core/styles';

import Input from '../UI/Input';
import Btn from '../UI/Button';

const styles = {
    form: {
        flexGrow: 1,
        direction: 'column',
        alignItems: 'center',
        width: '100%',
        padding: '1rem',
    },
};


let LoginComponents = inject("authStore")(observer(class Login extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
        };
        // Because we can't access to this in the class
        window.self = this;
    }
    
    componentWillUnmount() {
        window.self.props.authStore.reset();
    };
    
    handleEmailChange(e) {
        window.self.props.authStore.setEmail(e.target.value);
        console.log(e.target.value)
    };
    
    handlePasswordChange(e) {
        window.self.props.authStore.setPassword(e.target.value);
        console.log(e.target.value)
    };
    
    handleSubmitForm(e) {
        e.preventDefault();
        window.self.props.authStore.login()
            .then(() => null);
    };
    
    render() {
        const {values, errors, inProgress} = window.self.props.authStore;
        return (
            <Grid container justify='center' style={styles.form} item xs={12}>
                <Grid item xs={12} sm={7}>
                    <Btn> Connect with google </Btn>
                </Grid>
                <Grid item xl={3} style={{borderBottom:'1px solid #e8b861de' ,height: 30, width: '50%'}}>
                </Grid>
                <Grid item xs={12} sm={7}>
                    <Input
                        label="Email"
                        type="email"
                        autoComplete="email"
                        margin="normal"
                        fullWidth
                        onChange={this.handleEmailChange}
                    />
                </Grid>
                <Grid item xs={12} sm={7}>
                    <Input
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        margin="normal"
                        fullWidth
                        onChange={this.handlePasswordChange}
                    />
                </Grid>
                <Grid item xs={12} sm={7}>
                    <Btn style={{backgroundColor: 'orange', width: '100%', marginTop: 10}}> Log In </Btn>
                </Grid>
            </Grid>
        )
    };
}));

export default withStyles(styles)(LoginComponents);
