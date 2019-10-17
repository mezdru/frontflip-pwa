import React from 'react';
import {inject, observer} from 'mobx-react';
import ReactGA from 'react-ga';
import {Redirect} from 'react-router-dom';
import Auth from '../../components/auth/Auth';
import AuthLayout from '../../components/auth/AuthLayout';
import { getBaseUrl } from '../../services/utils.service';

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

console.debug('Loading AuthPage');

class AuthPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialTabState: 0,
      render: false
    };
    this.props.commonStore.setUrlParams(this.props.match);
  }
  
  componentWillReceiveProps(nextProps) {
    this.props.commonStore.setUrlParams(nextProps.match);
  }

  componentDidMount() {
    if (this.props.match && this.props.match.params && this.props.match.params.invitationCode) {
      this.props.authStore.setInvitationCode(this.props.match.params.invitationCode);

      // handle user is auth & try to user invitation code
      if(this.props.authStore.isAuth()) {
        this.props.authStore.registerToOrg()
        .then(() => {this.setState({redirectTo : getBaseUrl(this.props)})})
      } else {
        this.setState({initialTabState: 1, render: true});
      }
    }else {
      this.setState({render: true});
    }
  }
  
  render() {
    const { initialTab} = this.props;
    const {render, initialTabState, redirectTo} = this.state;

    console.debug('%c Render AuthPage.js', 'background-color: grey; padding: 6px 12px; border-radius: 5px; color: white;');
    if(redirectTo) return <Redirect to={redirectTo} push />;
    if(!render) return null; 

    return (
      <AuthLayout>
        <Auth initialTab={initialTab || initialTabState} />
      </AuthLayout>
    )
  }
}

export default inject('authStore', 'commonStore', 'orgStore')(observer(AuthPage));
