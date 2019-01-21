import React from 'react';
import {withTheme} from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import {Grid, Tab, Tabs} from '@material-ui/core';

import Login from './login/Login';
import Register from './register/Register';
import { injectIntl } from 'react-intl';
import {inject, observer} from 'mobx-react';
import { observe} from 'mobx';
import Banner from '../../components/utils/banner/Banner';
import Logo from '../../components/utils/logo/Logo';

class Auth extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 0
        }
    }

    componentDidMount() {
        if(this.props.authStore.values.invitationCode) this.setState({value: 1});
        observe(this.props.authStore.values, 'invitationCode', (change) => {
            this.setState({value: 1});
        });
    }
    
    handleChange = (event, value) => {
        this.setState({value});
    };
    
    handleChangeIndex = index => {
        this.setState({value: index});
    };
    
    render() {
        const {theme, classes} = this.props;
        let intl = this.props.intl;
        
        return (
            <Grid container spacing={16}>
                <Grid item xs={12} style={{marginTop: -8}}>
                    <Tabs
                        value={this.state.value}
                        onChange={this.handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        fullWidth={true}
                    >
                        <Tab label={intl.formatMessage({id: 'Sign In'})} style={{textAlign: 'left'}}/>
                        <Tab label={intl.formatMessage({id: 'Sign Up'})} style={{textAlign: 'right'}}/>
                    </Tabs>
                </Grid>
                <Grid item xs={12}>
                    <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={this.state.value}
                        onChangeIndex={this.handleChangeIndex}
                    >
                        <Login/>
                        <Register/>
                    </SwipeableViews>
                </Grid>
            </Grid>
        );
    }
}

export default inject('authStore')(
    withTheme()(injectIntl(observer(
        (Auth)
    )))
);
