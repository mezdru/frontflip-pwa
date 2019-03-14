import React from 'react';
import {inject, observer} from 'mobx-react';
import {Grid, Grow, Paper, Popper, ClickAwayListener, Button, IconButton, withStyles} from '@material-ui/core'
import {Add} from "@material-ui/icons";

const styles = {
  root: {
    display: 'flex',
    zIndex: 1,
  },
  paper: {
    width:'inherit',
    marginTop: 16,
    marginLeft: 10,
  },
  icon: {
    fontSize: 24,
  }
};

class AddContactField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    }
  }
  
  addLink = (typeOfField) => {
    this.props.addLink({type: typeOfField, value: ''});
    this.setState({open: false});
  }
  
  handleToggle = () => {
    this.setState(state => ({open: !state.open}));
  };
  
  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }
    this.setState({open: false});
  };
  
  getIcon = name => {
    switch (name) {
      case 'email':
        return name = 'envelope-o';
      case 'workplace':
        return name = 'user';
      case 'workchat':
        return name = 'comment';
      default:
        return name
    }
  }
  
  
  render() {
    const {classes} = this.props;
    const {open} = this.state;
    let linkName = ['email', 'phone', 'linkedin', 'twitter', 'facebook', 'github', 'link', 'workplace', 'workchat']
    
    return (
      <Grid container item className={classes.root} direction={'column'}>
        <Button
          fullWidth
          buttonRef={node => {
            this.anchorEl = node;
          }}
          aria-owns={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={this.handleToggle}
        >
          <Add fontSize="default"/>
          ADD MORE
        </Button>
        <Popper open={open} anchorEl={this.anchorEl} transition disablePortal>
          {({TransitionProps, placement}) => (
            <Grow
              {...TransitionProps}
              id="menu-list-grow"
              style={{transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'}}
            >
              <Grid item container xs={12} sm={8} md={6} lg={4} justify={'center'}>
                <Paper className={classes.paper}>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <Grid container justify={'center'} alignItems={'center'} spacing={8}>
                      {linkName.map((name, i) => {
                        return (
                          <Grid item key={i}>
                            <IconButton onClick={() => this.addLink(name)}>
                              <i className={classes.icon + " fa fa-" + this.getIcon(name)}/>
                            </IconButton>
                          </Grid>
                        )
                      })}
                    </Grid>
                  </ClickAwayListener>
                </Paper>
              </Grid>
            </Grow>)}
        </Popper>
      </Grid>
    )
  }
}

export default inject('commonStore', 'recordStore')(
  observer(
    withStyles(styles)(AddContactField)
  )
);
