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
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark
    }
  },
  suggestionWing: {
    backgroundColor: 'white',
    color: theme.palette.primary.dark,
    transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,.08)',
      color: theme.palette.primary.dark,
    }
  },
  removable: {
    paddingRight: 0,
  },
  animated: {
    background: theme.palette.secondary.main,
    color: 'white',
    opacity: 0,
    animation: 'appear 450ms ease-in 0ms 1 forwards',
  },
  '@keyframes appear': {
    from: { background: theme.palette.secondary.main, color: 'white', opacity: 0 },
    to: { background: theme.palette.primary.main, color: theme.palette.primary.dark, opacity: 1 }
  },
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
        onMouseDown={props.onMouseDown}
        onMouseUp={props.onMouseUp}
        onBlur={props.onBlur}
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
