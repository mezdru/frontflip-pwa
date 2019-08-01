import React from 'react';
import { IconButton, Popper, ClickAwayListener, Paper, MenuList, Grow, MenuItem, withStyles } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';

const styles = theme => ({
  button: {
    width: 40,
    marginLeft: 16,
    background: 'white',
    color: theme.palette.secondary.main,
    opacity: 0.7,
    transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backgroundColor: 'white',
      opacity: 1,
    }
  },
  popup: {
    zIndex: 1
  }
});

class MenuDropdown extends React.PureComponent {
  state = {
    open: false
  }

  handleClick = () => this.setState({ open: !this.state.open });

  handleClose = e => {
    if (this.anchorEl.contains(e.target)) {
      return;
    }
    this.setState({ open: false });
  }

  deleteAlert = () => {
    //@todo I18N !!!!!!!!!!!!!!
    alert("Do you really want to delete this awesome profile ?");
  };

  render() {
    const { classes, actions, open } = this.props;

    return (
      <>
        <Popper open={open} anchorEl={this.anchorEl} transition disablePortal className={classes.popup}>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="menu-list-grow"
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <MenuList>
                    {actions && actions.length > 0 && actions.map((action, index) => {
                      return (
                        <MenuItem key={index} button component="a" href={action.href}>
                          <FormattedMessage id={action.textId} />
                        </MenuItem>
                      )
                    })}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </>
    );
  }
}


export default withStyles(styles)(MenuDropdown);