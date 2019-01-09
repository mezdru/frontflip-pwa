import React from 'react';
import {Avatar} from '@material-ui/core';

export default class Logo extends React.Component{
    constructor(props){
        super(props)
    }
    
    render(){
        return(
            <Avatar src={this.props.src} alt="org-logo" className={this.props.className}/>
        )
    }
}
