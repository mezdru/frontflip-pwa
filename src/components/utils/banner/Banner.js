import React from 'react';
import {withStyles} from '@material-ui/core';

const styles = theme => ({
    root: {
        width: '100%',
        height: 166,
        boxShadow: '0 8px 20px -12px darkgrey',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        [theme.breakpoints.up('md')]: {
            height: 350,
        },
    }
});

const Banner = ({...props}) =>
    <div className={props.classes.root} style={{backgroundImage: `url(${props.src})`, ...props.style}}/>
;

export default withStyles(styles, {withTheme: true})(Banner);
