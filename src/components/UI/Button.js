import React from 'react';
import Button from '@material-ui/core/Button';


const Btn = ({...rest}) =>
    <Button style={{width: '100%'}} size="small" variant="extendedFab" {...rest}/>;

export default Btn
