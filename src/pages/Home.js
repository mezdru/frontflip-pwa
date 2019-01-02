import React from 'react'
import AuthPage from './auth/AuthPage';
import {inject, observer} from 'mobx-react';

let Home = inject("organisationStore")(observer(class Home extends React.Component {

    constructor(props){
        super(props);
    }

    componentDidMount() {
        if(this.props.match.params.organisationTag) {
            console.log(this.props.match.params.organisationTag);
            this.props.organisationStore.setOrgTag(this.props.match.params.organisationTag);
            this.props.organisationStore.getOrganisationForPublic();
        }
        console.log('locale : ' + this.props.match.params.locale);
        if(this.props.match.params.locale) {
            console.log(this.props);
        }
        console.log(this.props);
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
