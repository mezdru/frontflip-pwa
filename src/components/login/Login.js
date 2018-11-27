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
            // this login box is just an example
            <div className="auth-page">
            <div className="container page">
              <div className="row">
    
                <div className="col-md-6 offset-md-3 col-xs-12">
                  <h1 className="text-xs-center">Sign In</h1>
                  <p className="text-xs-center">
                    
                  </p>
    
    
                  <form onSubmit={window.self.handleSubmitForm}>
                    <fieldset>
    
                      <fieldset className="form-group">
                        <input
                          className="form-control form-control-lg"
                          type="email"
                          placeholder="Email"
                          value={values.email}
                          onChange={window.self.handleEmailChange}
                        />
                      </fieldset>
    
                      <fieldset className="form-group">
                        <input
                          className="form-control form-control-lg"
                          type="password"
                          placeholder="Password"
                          value={values.password}
                          onChange={window.self.handlePasswordChange}
                        />
                      </fieldset>
    
                      <button
                        className="btn btn-lg btn-primary pull-xs-right"
                        type="submit"
                        disabled={inProgress}
                      >
                        Sign in
                      </button>
    
                    </fieldset>
                  </form>
                </div>
    
              </div>
            </div>
          </div>
        );
    };
}));

export default (Login);