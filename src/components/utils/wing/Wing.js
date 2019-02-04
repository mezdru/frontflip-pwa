import React from 'react';
import { Avatar, Chip, withStyles } from '@material-ui/core';
import classNames from 'classnames';

const styles = theme => ({
  wingImg: {
    height: 48,
    width: 48,
    margin: '-5px -6px 0 -15px',
    boxShadow: 'none',
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  highlighted: {
    backgroundColor: theme.palette.primary.main
  }
});

const Wing = ({ src, label, ...props }) => {
  if (src) {
    return (
      <Chip
        avatar={<Avatar className={props.classes.wingImg} src={src} />}
        label={label}
        color={"secondary"}
        className={classNames(props.classes[props.className])}
        onClick={props.onClick}>
      </Chip>
    )
  } else {
    return (
      <Chip
        label={label}
        color={"secondary"}
        className={classNames(props.classes[props.className])}
        onClick={props.onClick}>
      </Chip>
    )
  }

};

export default withStyles(styles)(Wing)
