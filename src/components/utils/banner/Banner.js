import React from 'react';
import { observe } from 'mobx';
import { inject, observer } from "mobx-react";
import defaultBanner from '../../../resources/images/fly_away.jpg';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
  root: {
    width: '100%',
    height: 166,
    boxShadow: '0 8px 20px -12px darkgrey',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    [theme.breakpoints.up('md')]: {
      height: 350,
    },
  }
});

class Banner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.type || 'organisation',
      source: null
    }
  }

  componentDidMount() {
    if (this.state.type === 'organisation') {
      this.setState({
        source:
          ((this.props.organisationStore.values.organisation.cover && this.props.organisationStore.values.organisation.cover.url) ?
            this.props.organisationStore.values.organisation.cover.url : defaultBanner)
      });

      observe(this.props.organisationStore.values, 'organisation', (change) => {
        let org = this.props.organisationStore.values.organisation;
        this.setState({ source: (org.cover && org.cover.url ? org.cover.url : defaultBanner) });
      });
    }
  }

  render() {
    const { source } = this.state;

    return (
      <div className={this.props.classes.root} style={{ backgroundImage: `url(${source})`, ...this.props.style }} />
    )
  }
}

export default inject('organisationStore')(
  observer(
    withStyles(styles, { withTheme: true })(Banner)
  )
);