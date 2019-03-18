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
    backgroundColor: theme.palette.primary.dark,
    color: 'white',
  },
  button: {
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  },
  suggestionWing: {
    backgroundColor: 'white',
    color: theme.palette.primary.dark,
    transition: 'all .3s ease-out',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,.08)',
      color: theme.palette.primary.dark,
    }
  },
  removable: {
    paddingRight: 0,
  }
});

const Wing = ({ src, label, ...props }) => {
  if (src) {
    return (
      <Chip
        avatar={<Avatar className={props.classes.wingImg} src={src} alt="wings-img"/>}
        label={label}
        color={"primary"}
        className={classNames(props.classes[props.className], (props.onDelete ? props.classes.removable : null) )}
        onClick={props.onClick}
        onDelete={props.onDelete}
        >
      </Chip>
    )
  } else {
    return (
      <Chip
        label={label}
        color={"primary"}
        className={classNames(props.classes[props.className], (props.onDelete ? props.classes.removable : null))}
        onClick={props.onClick}
        onDelete={props.onDelete} >
      </Chip>
    )
  }

};

export default withStyles(styles)(Wing)
