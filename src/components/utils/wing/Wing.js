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
  },
  button: {
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  },
  suggestionWing: {
    backgroundColor: 'white',
    color: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,.08)',
      color: theme.palette.secondary.main,
    }
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
        onClick={props.onClick}
        onDelete={props.onDelete}
        >
      </Chip>
    )
  } else {
    return (
      <Chip
        label={label}
        color={"secondary"}
        className={classNames(props.classes[props.className])}
        onClick={props.onClick}
        onDelete={props.onDelete} >
      </Chip>
    )
  }

};

export default withStyles(styles)(Wing)
