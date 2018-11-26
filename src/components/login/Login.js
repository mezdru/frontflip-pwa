import React from 'react';
import { inject, observer } from 'mobx-react';

let Login = inject("authStore")(  observer(class Login extends React.Component {

    constructor(props) {
        super(props);
        // Because we can't access to this in the class
        window.self = this;
    }

    componentWillUnmount() {
        window.self.props.authStore.reset();
    };

    handleEmailChange(e) {
        window.self.props.authStore.setEmail(e.target.value);
    };

    handlePasswordChange(e) {window.self.props.authStore.setPassword(e.target.value)};

    handleSubmitForm(e) {
        e.preventDefault();
        window.self.props.authStore.login()
            .then(() => null);
    };
    
    render() {
        const { values, errors, inProgress} = window.self.props.authStore;
        return (
            <div className="auth-page">
            </div>
        );
    };
}));

export default (Login);