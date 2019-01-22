import React from 'react'
import { inject, observer} from 'mobx-react';
import {observe} from 'mobx';
import { withStyles } from '@material-ui/core';

const styles = {

};

class ProfileLayout extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    };

    render(){
        const { hit } = this.props;

        if(hit) {
            return(
                <div>
                    {hit.name || hit.tag}
                </div>
            )
        } else {
            return (<div>You should provide a hit.</div>);
        }


    }
};

export default inject('commonStore', 'organisationStore', 'authStore', 'recordStore', 'userStore')(
    observer(
        withStyles(styles)(ProfileLayout)
    )
);
