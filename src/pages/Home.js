import React from 'react'
import AuthPage from './auth/AuthPage';
import { inject, observer } from 'mobx-react';

let Home = inject("organisationStore", "commonStore", "authStore")(observer(class Home extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.match && this.props.match.params && this.props.match.params.invitationCode) {
      this.props.authStore.setInvitationCode(this.props.match.params.invitationCode);
    }
    if (this.props.match && this.props.match.params && this.props.match.params.organisationTag) {
      this.props.organisationStore.setOrgTag(this.props.match.params.organisationTag);
      this.props.organisationStore.getOrganisationForPublic();
    }
  }

  render() {
    return (
      <div>
        <AuthPage />
      </div>
    );
  }
}));

export default Home;
