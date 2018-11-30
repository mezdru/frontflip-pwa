import React from 'react'
import { inject, observer } from 'mobx-react';


let ProfileBox = inject("recordStore")(  observer(class ProfileBox extends React.Component {

    constructor(props) {
        super(props);
        // Because we can't access to this in the class
        window.self = this;
    }

    componentDidMount() {
        window.self.props.recordStore.setOrgId('5bfec1068e33bc08bc139340');
        window.self.props.recordStore.setRecordId('5bfd084ccbc3b70c3cd3846e');
        window.self.props.recordStore.getRecord();
    };

    render(){
        const { values, errors, inProgress} = window.self.props.recordStore;
        return(
            <div>
                This is the profile of
                <div>
                    {values.record.name}
                </div>
            </div>
        );
    }
}));

export default (ProfileBox);