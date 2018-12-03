import React from 'react';
import {withTheme} from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import {AppBar, Grid, Tab, Tabs, Typography} from '@material-ui/core';

import Login from './Login';
import SignUp from './SignUp';

import './Form.css';

function TabContainer({children, dir}) {
    return (
        <Typography component="div" dir={dir}>
            {children}
        </Typography>
    );
}

class Form extends React.Component {
    state = {
        value: 0,
    };
    
    handleChange = (event, value) => {
        this.setState({value});
    };
    
    handleChangeIndex = index => {
        this.setState({value: index});
    };
    
    render() {
        const {theme} = this.props;
        
        return (
            <Grid container direction="column"
                  justify="center"
                  alignItems="center"
                  className="form-root">
                <Grid item xs={12} style={{width: '100%'}}>
                    <AppBar position="static" className="form-tab-bar">
                        <Tabs
                            value={this.state.value}
                            onChange={this.handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            fullWidth
                        >
                            <Tab id="form-tab-left" label="Sign In"/>
                            <Tab id="form-tab-right" label="Sign Up"/>
                        </Tabs>
                    </AppBar>
                </Grid>
                <Grid item xs={12} style={{width: '100%'}}>
                    <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={this.state.value}
                        onChangeIndex={this.handleChangeIndex}
                        style={{ width:'100%'}}
                    >
                        <TabContainer dir={theme.direction}><Login/></TabContainer>
                        {/* <TabContainer dir={theme.direction}><SignUp/></TabContainer> */}
                    </SwipeableViews>
                </Grid>
            </Grid>
        );
    }
}


export default withTheme()(Form);
