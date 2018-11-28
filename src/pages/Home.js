import React from 'react'
import Button from '@material-ui/core/Button';
import Login from '../components/login/Login';
import InputWithRadius from '../components/utils/inputs/InputWithRadius';

export class Home extends React.Component {

    render(){
        return(
            <div>
                This is Home
                <Login/>
                <InputWithRadius label='Your password' />
            </div>
        );
    }
}