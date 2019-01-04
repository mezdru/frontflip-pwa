import React from 'react';
import {Avatar, Chip, withStyles} from '@material-ui/core';

const styles = {
    chipImg: {
        height: 48,
        width: 48,
        margin: '-5px -6px 0 -15px',
        boxShadow: 'none',
        backgroundColor: 'transparent',
        overflow: 'visible',
    }
};

const Wing = ({src, label, ...props}) => {
    return (
        <Chip
            avatar={<Avatar className={props.classes.chipImg} src={src}/>}
            label={label} color={"secondary"}>
        </Chip>
    )
};

export default withStyles(styles)(Wing)
