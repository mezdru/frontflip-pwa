import React from 'react';
import { Popper, Paper, MenuList, Grow, MenuItem, withStyles } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { withProfileManagement } from '../../../hoc/profile/withProfileManagement';

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
    zIndex: 1,
    marginTop: 16,
    right: 16 ,
  }
});

class MenuDropdown extends React.PureComponent {
  state = {
    open: false
  }

  deleteAlert = () => {
    //@todo I18N !!!!!!!!!!!!!!
    alert("Do you really want to delete this awesome profile ?");
  };

  render() {
    const { classes, actions, open, mode } = this.props;

    return (
        <Popper 
          open={open} 
          disablePortal 
          transition 
          className={classes.popup} 
          placement="bottom-end"
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="menu-list-grow"
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                  <MenuList>
                    {mode === 'filter' && (
                      <MenuItem key={-1} button onClick={() => this.props.profileContext.filterProfile(null)}>
                        <FormattedMessage id="profile.filter.default" />
                      </MenuItem>
                    )}
                    {actions && actions.length > 0 && actions.map((action, index) => {

                      if(mode === 'filter') {
                        return (
                          <MenuItem key={index} button onClick={() => this.props.profileContext.filterProfile(action.wingId)}>
                            {action.text}
                          </MenuItem>
                        )
                      } else {
                        return (
                          <MenuItem key={index} button component="a" href={action.href}>
                            <FormattedMessage id={action.textId} />
                          </MenuItem>
                        )
                      }

                    })}
                  </MenuList>
              </Paper>
            </Grow>
          )}
        </Popper>
    );
  }
}


export default withStyles(styles)(withProfileManagement(MenuDropdown));