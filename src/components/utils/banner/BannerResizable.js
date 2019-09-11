import React from 'react';
import { observe } from 'mobx';
import { inject, observer } from "mobx-react";
import defaultBanner from '../../../resources/images/fly_away.jpg';
import { withStyles } from '@material-ui/core';
import { withProfileManagement } from '../../../hoc/profile/withProfileManagement';

const styles = theme => ({
  root: {
    position: 'relative',
    top:0,
    width: '100%',
    minHeight: 64,
    backgroundColor: 'white',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
  },
});

const MEDIUM_HEIGHT = 50;

class BannerResizable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      observer: ()=>{},
      source: this.props.source,
      initialHeight: this.props.initialHeight || MEDIUM_HEIGHT,
    }
  }

  componentDidMount() {
    if (this.props.type === 'organisation') {
      this.updateSource();

      this.setState({observer: observe(this.props.organisationStore.values, 'organisation', (change) => {
        this.updateSource();
      })});

      if(this.props.listenToScroll) this.listenToScroll();
      
    } else if (this.props.type === 'profile') {

      if(!this.updateProfileSource()) this.updateSource();

      this.setState({observer: observe(this.props.recordStore.values, 'displayedRecord', (change) => {
        this.updateProfileSource();
        if(!this.state.source) this.updateSource();
      })});
    }
  }

  updateProfileSource = async () => {
    var profileCover = this.props.recordStore.values.displayedRecord.cover;
    var profileCoverUrl = (profileCover && profileCover.url ? profileCover.url : null);
    this.setState({source: profileCoverUrl});
    return profileCoverUrl;
  }

  updateSource = () => {
    var orgCover = this.props.organisationStore.values.organisation.cover;
    var orgCoverUrl = (orgCover && orgCover.url ? orgCover.url : defaultBanner);
    this.setState({source: orgCoverUrl});
  }

  componentWillUnmount() {
    this.state.observer();
  }

  render() {
    const { source, initialHeight } = this.state;
    const { classes } = this.props;

    return (
      <>
          <div className={classes.root} style={{backgroundImage: `url(${source})`, height: initialHeight + 'vh', ...this.props.style}} id="bannerResizable" >
            {this.props.children}
          </div>
      </>
    )
  }
}

export default inject('organisationStore', 'recordStore')(
  observer(
    withStyles(styles, { withTheme: true })(withProfileManagement(BannerResizable))
  )
);