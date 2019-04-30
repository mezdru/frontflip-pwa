import React from 'react';
import { observe } from 'mobx';
import { inject, observer } from "mobx-react";
import defaultBanner from '../../../resources/images/fly_away.jpg';
import { withStyles } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

let interval;

const styles = theme => ({
  root: {
    position: 'relative',
    top:0,
    width: '100%',
    minHeight: 64,
    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 8px 0px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 3px 3px -2px',
    backgroundColor: 'white',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    overflow: 'hidden',
    zIndex: 1000,
  },
  bannerMinRelative: {
    position: 'relative',
    height: 64,
  },
  bannerBackdrop: {
    position: 'fixed',
    height: '100%',
    width: '100%',
    top:0,
    left:0,
    zIndex: 999,
    backgroundColor: 'rgba(0, 0, 0, .5)'
  }
});

const MEDIUM_HEIGHT = 50;

class BannerResizable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      observer: ()=>{},
      source: this.props.source,
      initialHeight: this.props.initialHeight || MEDIUM_HEIGHT,
      bannerState: 'initial'
    }
  }

  componentDidMount() {
    if (this.props.type === 'organisation') {
      this.updateSource();

      this.setState({observer: observe(this.props.organisationStore.values, 'organisation', (change) => {
        this.updateSource();
      })});

      if(this.props.listenToScroll) this.listenToScroll();
    }
  }

  updateSource = () => {
    var orgCover = this.props.organisationStore.values.organisation.cover;
    var orgCoverUrl = (orgCover && orgCover.url ? orgCover.url : defaultBanner);
    this.setState({source: orgCoverUrl});
  }

  /**
   * @description Listen to scroll event in order to reduce banner size to his min height.
   */
  listenToScroll = () => {
    window.addEventListener('scroll', function(e) {
      this.minifyBanner();
    }.bind(this));
  }

  isScrollPossible = () => {
    return (document.documentElement.scrollHeight > document.documentElement.clientHeight);
  }

  // /**
  //  * @description Listen to click event on banner to increase banner size to his medium height.
  //  */
  // listenToInteraction = () => {
  //   var banner = document.getElementById('bannerResizable');

  //   banner.addEventListener('click', function(e) {
  //     this.increaseBanner();
  //   }.bind(this));
  // }

  minifyBanner = () => {
    if(interval || this.state.bannerState === 'min') return;

    var banner = document.getElementById('bannerResizable');
    var child = banner.firstChild;
    var secondChild = child.lastChild;

    var heightValue = (this.state.bannerState !== 'initial' ) ? MEDIUM_HEIGHT : this.state.initialHeight;
    var topValue = 50;
    var opacityValue = 1;

    if(this.isScrollPossible()) {
      banner.style.position = 'fixed';
    }

    interval = setInterval(() => {
      if(secondChild) secondChild.style.opacity = (Math.max(opacityValue -= 0.05, 0));

      banner.style.height = (heightValue -= 2) + 'vh';
      child.style.top = (Math.max(0, (topValue -= 2))) + '%';
      child.style.transform = 'translateY(-' + (Math.max(0, (topValue -= 2))) + '%)';
      if(heightValue <= 0) {
        this.setState({bannerState: 'min'});
        interval = clearInterval(interval);
      } 
    }, 15);
  }

  // increaseBanner = () => {
  //   if(! (this.state.bannerState === 'min')) return; 

  //   var banner = document.getElementById('bannerResizable');
  //   var child = banner.firstChild;
  //   var secondChild = child.lastChild;

  //   var heightValue = 0;
  //   var opacityValue = 0;

  //   child.style.top = '50%';
  //   child.style.transform = 'translateY(-50%)';

  //   this.setState({bannerState: MEDIUM_HEIGHT});  

  //   interval = setInterval(() => {
  //     if(secondChild) secondChild.style.opacity = (Math.min(opacityValue += 0.05, 1));

  //     banner.style.height = (heightValue += 2) + 'vh';
  //     if(heightValue >= MEDIUM_HEIGHT) {
  //       interval = clearInterval(interval); 
  //     } 
  //   }, 15);
  // }


  componentWillUnmount() {
    this.state.observer();
  }

  render() {
    const { source, initialHeight, bannerState } = this.state;
    const { classes } = this.props;

    return (
      <>
        {bannerState !== 'initial' && this.isScrollPossible() && (<div className={classes.bannerMinRelative}></div>)}
        <ClickAwayListener onClickAway={(e) => {this.minifyBanner()}} >
          <div className={classes.root} style={{backgroundImage: `url(${source})`, height: initialHeight + 'vh', ...this.props.style}} id="bannerResizable" >
            {this.props.children}
          </div>
        </ClickAwayListener>
        {bannerState !== 'initial' && bannerState !== 'min' && this.isScrollPossible() && (
          <div className={classes.bannerBackdrop}></div>
        )}
      </>
    )
  }
}

export default inject('organisationStore')(
  observer(
    withStyles(styles, { withTheme: true })(BannerResizable)
  )
);