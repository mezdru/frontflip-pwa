import React from 'react';
import withClapManagement from "../../../hoc/ClapManagement.hoc";
import { withStyles, Typography } from '@material-ui/core';
import { styles } from './Wings.css';
import ApplauseIcon from '../../../resources/icons/Applause.js';
import classNames from 'classnames';
import ClickBurst from '../../../hoc/ClickBurst';
import { Clear } from '@material-ui/icons';

let interval;

class Wings extends React.PureComponent {

  state = {
    addClapCounterLocal: 0,
    currentClapAdded: 0,
    canClap: false,
    intervalDuration: 455, // BPM of Boogie Wonderland (In The Style Of Earth, Wind & Fire)
    rateLimitActive: false
  }

  componentDidMount() {
    this.setState({ canClap: this.props.canClap(this.props.recordId) });

    if(this.props.mode === 'profile') {
      this.unsubscribeClapCount = this.props.observeClapCount((change) => {
        this.forceUpdate();
      });
    }
  }

  componentWillUnmount() {
    if(this.unsubscribeClapCount) this.unsubscribeClapCount();
  }

  handleClapDown = (e) => {
    if (!this.state.canClap || this.state.rateLimitActive) return;

    this.setState({rateLimitActive: true}, () => {
      setTimeout(() => {
        this.setState({rateLimitActive: false});
      }, this.state.intervalDuration);
    })

    e.currentTarget.addEventListener('mouseout', this.handleClapUp);
    e.currentTarget.addEventListener('touchleave', this.handleClapUp);

    this.setState({ addClapCounterLocal: this.state.addClapCounterLocal + 1, currentClapAdded: this.state.currentClapAdded + 1 });
    
    interval = setInterval(() => {
      this.setState({ addClapCounterLocal: this.state.addClapCounterLocal + 1, currentClapAdded: this.state.currentClapAdded + 1 })
    }, this.state.intervalDuration);
  }

  handleClapUp = (e) => {
    if (!this.state.canClap) return;
    clearInterval(interval);
    if (this.state.currentClapAdded === 0) return;
    this.props.handleClap(this.props.recordId, this.props.hashtagId, this.state.currentClapAdded);
    this.setState({ currentClapAdded: 0 });
  }

  getClasseByMode = () => {
    switch (this.props.mode) {
      case "card":
        return this.props.classes.cardMode;
      case "profile":
        return this.props.classes.profileMode;
      case "highlight":
        return this.props.classes.highlightMode;
      case "button":
        return this.props.classes.buttonMode;
      case "person":
        return this.props.classes.personMode;
      case "suggestion":
        return this.props.classes.suggestionMode;
      case "onboard": return this.props.classes.onboardMode;
      default:
        return null;
    }
  }

  render() {
    const { classes, label, src, enableClap, onDelete } = this.props;
    const { addClapCounterLocal, intervalDuration, canClap } = this.state;
    const remoteClaps = this.props.mode === 'profile' ?  this.props.getClapCount(this.props.hashtagId) || this.props.claps : this.props.claps;
    let claps = addClapCounterLocal + remoteClaps;
    claps = (claps > 0 ? claps : null);
    const classMode = this.getClasseByMode();
    
    return (
      <div className={classNames(classes.root, classMode)} >
        {src && (
          <div className={classes.avatar} onClick={this.props.onClick}>
            <img src={src} alt="emoji" />
          </div>
        )}
        <span className={classes.label} onClick={this.props.onClick}>
          <Typography variant="body1">
            {label}
          </Typography>
        </span>

        {canClap && enableClap && (
          <ClickBurst intervalDuration={intervalDuration}>
            <div className={classes.clapRoot} id="clap"
              onMouseDown={this.handleClapDown}
              onMouseUp={this.handleClapUp}
            >
              <ApplauseIcon className={classNames(classMode, classes.applauseIcon)} />
              <span>
                {claps}
              </span>
            </div>
          </ClickBurst>
        )}

        {!canClap && enableClap && (
          <div className={classes.clapRoot} id="clap" >
            <ApplauseIcon className={classNames(classMode, classes.applauseIcon)} />
            <span>
              {claps}
            </span>
          </div>
        )}

        {onDelete && (
          <div className={classes.clapRoot} onClick={onDelete} >
            <Clear style={{marginTop: -2}}/>
          </div>
        )}

      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(withClapManagement(Wings));
