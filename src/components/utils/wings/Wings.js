import React from 'react';
import {Avatar, Chip} from '@material-ui/core';

import './Wings.css'

const Wings = ({src, label}) => {
    return (
        <Chip
            avatar={<Avatar id='wings-img' src={src}></Avatar>}
            label={label} id='wings'>
        </Chip>
    )
};

export default Wings
