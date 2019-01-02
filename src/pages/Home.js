import React from 'react'
import AuthPage from './auth/AuthPage';
import {inject, observer} from 'mobx-react';
import { matchPath } from 'react-router'



let Home = inject("organisationStore", "commonStore")(observer(class Home extends React.Component {

    constructor(props){
        super(props);

        // Due to a bug of react-router-dom, url parameters are not transmetted to nested routes.
        const matchLocale = matchPath(this.props.history.location.pathname, {
            path: '/:locale',
            exact: false,
            strict: false
          });

          this.props.commonStore.setCookie('locale',matchLocale.params.locale)

        console.log('locale : ' + matchLocale.params.locale);
    }

    componentDidMount() {
        if(this.props.match.params.organisationTag) {
            console.log(this.props.match.params.organisationTag);
            this.props.organisationStore.setOrgTag(this.props.match.params.organisationTag);
            this.props.organisationStore.getOrganisationForPublic();
        }
    }

    render(){
        return(
            <div>
                <AuthPage/>
            </div>
        );
    }
}));

export default Home;
