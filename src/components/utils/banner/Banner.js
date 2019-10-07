import React from 'react';
import { observe } from 'mobx';
import { inject, observer } from "mobx-react";
import defaultBanner from '../../../resources/images/fly_away.jpg';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
  root: {
    width: '100%',
    height: 222,
    [theme.breakpoints.up('md')]: {
      height: 416,
    },
  },
  rootBanner: {
    position: 'absolute',
    width: '100%',
    height: 222,
    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 8px 0px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 3px 3px -2px',
    backgroundColor: 'white',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    [theme.breakpoints.up('md')]: {
      height: 416,
    },
  }
});

class Banner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.type || 'organisation',
      source: null,
      observer: ()=>{}
    }
  }

  componentDidMount() {
    if (this.state.type === 'organisation') {
      this.setState({
        source:
          ((this.props.orgStore.values.organisation.cover && this.props.orgStore.values.organisation.cover.url) ?
            this.props.orgStore.values.organisation.cover.url : defaultBanner)
      });

      this.setState({observer: observe(this.props.orgStore.values, 'organisation', (change) => {
        let org = this.props.orgStore.values.organisation;
        this.setState({ source: (org.cover && org.cover.url ? org.cover.url : defaultBanner) });
      })});
    }
  }

  componentWillUnmount() {
    this.state.observer();
  }

  render() {
    const { source } = this.state;

    return (
      <div className={this.props.classes.root} >
        <div style={{ backgroundImage: `url(${this.props.source || source})`, ...this.props.style }} className={this.props.classes.rootBanner}>
        </div>
        {this.props.children}
      </div>
    )
  }
}

export default inject('orgStore')(
  observer(
    withStyles(styles, { withTheme: true })(Banner)
  )
);