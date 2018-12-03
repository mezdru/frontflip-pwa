import React from 'react';
import './ButtonRadius.css';
import Button from '@material-ui/core/Button';

const ButtonRadius = ({...rest}) =>
    <Button className={`buttonRadius`} variant="contained" {...rest}/>;

export default (ButtonRadius);
