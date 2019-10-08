import React from 'react';
import {inject, observer} from 'mobx-react';
import ReactGA from 'react-ga';

import Auth from '../../components/auth/Auth';
import AuthLayout from '../../components/auth/AuthLayout';

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

console.debug('Loading AuthPage');

class AuthPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialTabState: 0
    };
    this.props.commonStore.setUrlParams(this.props.match);
  }
  
  componentWillReceiveProps(nextProps) {
    this.props.commonStore.setUrlParams(nextProps.match);
  }

  componentDidMount() {
    if (this.props.match && this.props.match.params && this.props.match.params.invitationCode) {
      this.props.authStore.setInvitationCode(this.props.match.params.invitationCode);
      this.setState({initialTabState: 1});
    }
  }
  
  render() {
    const { initialTab} = this.props;
    const {initialTabState} = this.state;

    console.debug('%c Render AuthPage.js', 'background-color: grey; padding: 6px 12px; border-radius: 5px; color: white;');

    return (
      <AuthLayout>
        <Auth initialTab={initialTab || initialTabState} />
      </AuthLayout>
    )
  }
}

export default inject('authStore')(observer(AuthPage));
