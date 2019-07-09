import React from 'react';
import withClapManagement from "../../../hoc/ClapManagement.hoc";
import { withStyles } from '@material-ui/core';
import {styles} from './Wings.css';
import applauseIcon from '../../../resources/icons/applause_black.png';

let interval;

class Wings extends React.PureComponent {

  state = {
    addClapCounterLocal: 0,
    currentClapAdded: 0,
    canClap: false
  }

  componentDidMount() {
    this.setState({canClap: this.props.canClap(this.props.recordId)});
  }

  handleClapDown = (e) => {
    if(!this.state.canClap) return;

    e.currentTarget.addEventListener('mouseout', (e2) => {
      this.handleClapUp();
    });

    this.setState({addClapCounterLocal: this.state.addClapCounterLocal + 1, currentClapAdded: this.state.currentClapAdded + 1})
    interval = setInterval(() => {
      this.setState({addClapCounterLocal: this.state.addClapCounterLocal + 1, currentClapAdded: this.state.currentClapAdded + 1})
    }, 400);
  }

  handleClapUp = (e) => {
    if(!this.state.canClap) return;
    clearInterval(interval);
    if(this.state.currentClapAdded === 0) return;
    this.props.handleClap(this.props.recordId, this.props.hashtagId, this.state.currentClapAdded);
    this.setState({currentClapAdded: 0});
  }

  render() {
    const {classes, label, src} = this.props;
    const {addClapCounterLocal} = this.state;
    const claps = addClapCounterLocal + this.props.getClapCount(this.props.hashtagId);

    return (
      <div className={classes.root} >
        {src && (
          <div className={classes.avatar}>
            <img src={src} alt="emoji" />
          </div>
        )}
        <span className={classes.label}>
          {label}
        </span>
  
        <div className={classes.clapRoot} 
          onMouseDown={this.handleClapDown} 
          onMouseUp={this.handleClapUp} 
        >
          <img src={applauseIcon} alt="applause"/>
          <span>
            {claps}
          </span>
        </div>
  
      </div>
    )
  }
}

export default withStyles(styles)(withClapManagement(Wings));