import React from 'react';
import {Avatar, withStyles, Typography} from '@material-ui/core';
import {inject, observer} from "mobx-react";
import Logo from '../logo/Logo';
const defaultLogo = 'https://pbs.twimg.com/profile_images/981455890342694912/fXaclV2Y_400x400.jpg';

const style = theme => ({
    orgItem: {
        position: 'relative',
        display: 'inline-block',
        width: '33%',
        textAlign: 'center',
        padding: 8,
        paddingTop: 0,
    },
    orgsContainer: {
        position: 'relative',
        width: '100%',
        listStyleType: 'none',
        padding:0,
        textAlign: 'left',
        paddingLeft: 8,
        paddingRight: 8,
    },
    itemLogo: {
        position: 'relative',
        left: 0,
        right: 0,
        margin: 'auto'
    },
    itemName: {
        textTransform: 'uppercase',
        fontSize: '0.675rem',
        fontWeight: '600',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
    },
    borderBox: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        height:'30%',
        right:0,
        borderRight: '1px solid rgba(0, 0, 0, 0.12)'
    }
});

class OrganisationsList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        this.props.organisationStore.getCurrentUserOrganisations().then(()=> {
            this.forceUpdate();
        });
    }
    
    render(){
        const {currentUserOrganisations} = this.props.organisationStore.values;
        const {classes} = this.props;

        return(
            <ul className={classes.orgsContainer}>
                {currentUserOrganisations.map((org, i) => {return (
                        <li className={classes.orgItem} key={org._id}>
                            <Logo type={'smallOrg'} alt={org.name} src={org.logo.url || defaultLogo} className={classes.itemLogo} />
                            <div className={classes.itemName} >{org.name}</div>
                            { (((i+1)%3 !== 0) && currentUserOrganisations.length > i+1) && (
                                <div className={classes.borderBox}></div>
                            )}
                        </li>
                );})}
            </ul>
        )
    }
}

export default inject('organisationStore')(
    observer(
        withStyles(style, {withTheme: true})(OrganisationsList)
    )
);