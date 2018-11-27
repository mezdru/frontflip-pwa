import React from 'react'
import { inject, observer } from 'mobx-react';


let ProfileBox = inject("recordStore")(  observer(class ProfileBox extends React.Component {

    constructor(props) {
        super(props);
        // Because we can't access to this in the class
        window.self = this;
    }

    componentDidMount() {
        window.self.props.recordStore.setOrgTag('isen');
        window.self.props.recordStore.setRecordTag('@QuentinMezdru');
        window.self.props.recordStore.getRecordByTag();
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