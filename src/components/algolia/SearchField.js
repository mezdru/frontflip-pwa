import React from 'react'
import { inject, observer } from 'mobx-react';


let SearchField = inject("organisationStore", "commonStore")(  observer(class SearchField extends React.Component {

    constructor(props) {
        super(props);
        // Because we can't access to this in the class
        window.self = this;
    }

    componentDidMount() {
        window.self.props.organisationStore.setOrgTag('wingzy');
        window.self.props.organisationStore.getOrganisationForPublic()
        .then(()=>{
            window.self.props.organisationStore.getAlgoliaKey();
        });
    };

    render(){
        const { values } = window.self.props.organisationStore;
        const { algoliaKey }  = window.self.props.commonStore;
        return(     
            <div>
                This is the algolia key of {values.organisation.tag}
                <div>
                    {algoliaKey}
                </div>
            </div>
        );
    }
}));

export default (SearchField);