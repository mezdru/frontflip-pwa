import React from 'react'
import Button from '@material-ui/core/Button';
import Login from '../components/login/Login';

export class Home extends React.Component {

    render(){
        return(
            <div>
                This is Home
                <Login/>
            </div>
        );
    }
}