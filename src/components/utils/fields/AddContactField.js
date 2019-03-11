import React from 'react';
import {Grid, Grow, Paper, Popper, ClickAwayListener, Button, IconButton, withStyles, TextField} from '@material-ui/core'
import {Add} from "@material-ui/icons";
import {inject, observer} from "mobx-react";

const styles = theme => ({
  root: {
    display: 'flex',
    zIndex: 1,
  },
  paper: {
    marginTop: 8,
    marginRight: 16,
  }
});

class AddContactField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      infos:[{
        label: ''
      }]
    }
  }
  
  addInfo= (typeOfField) => {
    this.props.recordStore.values.record.links.push({"_id": "new_"+(new Date()).getMilliseconds(),"type":typeOfField,"value":""})
    this.props.parent.forceUpdate();
    console.log(JSON.stringify(this.props.recordStore.values.record.links))
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
  
  render() {
    const {classes} = this.props;
    const {open} = this.state;
    let {infos} = this.state;
    
    return (
      <div className={classes.root}>
        <Button
          className={classes.button}
          fullWidth={true}
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
              <Paper className={classes.paper}>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <Grid container style={{color: 'red'}} justify={'space-between'}>
                    <Grid item>
                      <IconButton onClick={() => this.addInfo('twitter')}>
                        <i className="fa fa-twitter"/>
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton onClick={() => this.addInfo('facebook')}>
                        <i className="fa fa-facebook"/>
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton onClick={() => this.addInfo('github')}>
                        <i className="fa fa-github"/>
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton onClick={() => this.addInfo('link')}>
                        <i className="fa fa-link"/>
                      </IconButton>
                    </Grid>
                  </Grid>
                </ClickAwayListener>
              </Paper>
            </Grow>)}
        </Popper>
      </div>
    )
  }
}

export default inject('commonStore', 'recordStore')(
  observer(
    withStyles(styles)(AddContactField)
  )
);
