import React from 'react';
import { observe } from 'mobx';
import { inject, observer } from "mobx-react";
import defaultBanner from '../../../resources/images/fly_away.jpg';
import { withStyles } from '@material-ui/core';

let interval;

const styles = theme => ({
  root: {
    position: 'relative',
    top:0,
    width: '100%',
    // height: 222,
    minHeight: 64,
    // [theme.breakpoints.up('md')]: {
    //   height: 416,
    // },
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
  }
});

const MEDIUM_HEIGHT = 50;

class BannerResizable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      observer: ()=>{},
      source: this.props.source,
      initialHeight: this.props.initialHeight || MEDIUM_HEIGHT
    }
  }

  componentDidMount() {
    if (this.props.type === 'organisation') {
      this.updateSource();

      this.setState({observer: observe(this.props.organisationStore.values, 'organisation', (change) => {
        this.updateSource();
      })});

      if(this.props.listenToScroll) this.listenToScroll();
      if(this.props.listenToInteraction) this.listenToInteraction();
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
      if(interval || this.state.bannerState === 'min') return;

      var banner = document.getElementById('bannerResizable');
      var child = banner.firstChild;
      var heightValue = this.state.bannerState ? MEDIUM_HEIGHT : this.state.initialHeight;

      child.style.top = '0px';
      child.style.transform = 'none';
      banner.style.position = 'fixed';

      this.setState({bannerState: 'min'});

      interval = setInterval(() => {
        banner.style.height = (heightValue -= 2) + 'vh';
        if(heightValue <= 0) interval = clearInterval(interval);
      }, 15);
    }.bind(this));
  }

  /**
   * @description Listen to click event on banner to increase banner size to his medium height.
   */
  listenToInteraction = () => {
    var banner = document.getElementById('bannerResizable');

    banner.addEventListener('click', function(e) {
      if(! (this.state.bannerState === 'min')) return; 

      var child = banner.firstChild;
      var heightValue = 0;

      child.style.top = '50%';
      child.style.transform = 'translateY(-50%)';

      this.setState({bannerState: MEDIUM_HEIGHT});

      interval = setInterval(() => {
        banner.style.height = (heightValue += 2) + 'vh';
        if(heightValue >= MEDIUM_HEIGHT) interval = clearInterval(interval);
      }, 15);
    }.bind(this));
  }


  componentWillUnmount() {
    this.state.observer();
  }

  render() {
    const { source, initialHeight, bannerState } = this.state;
    const { classes } = this.props;

    return (
      <>
        {bannerState === 'min' && (<div className={classes.bannerMinRelative}></div>)}
        <div className={classes.root} style={{backgroundImage: `url(${source})`, height: initialHeight + 'vh', ...this.props.style}} id="bannerResizable" >
          {this.props.children}
        </div>
      </>
    )
  }
}

export default inject('organisationStore')(
  observer(
    withStyles(styles, { withTheme: true })(BannerResizable)
  )
);