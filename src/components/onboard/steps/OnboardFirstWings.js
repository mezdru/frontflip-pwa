import React from 'react'
import { withStyles } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import { observe } from 'mobx';
import AlgoliaService from '../../../services/algolia.service.js';

const styles = theme => ({
  firstWingsList: {
    listStyleType: 'none',
    padding: 8,
    width: '100%',
    overflowX: 'scroll',
    whiteSpace: 'nowrap',
  },
  firstWing: {
    textAlign: 'center',
    display: 'inline-block',
    width: 150,
    padding: 8,
    '& img': {
      width: 150,
      height: 150,
      borderRadius: 75,
    },
    '& div': {
      position: 'relative',
    },
    '& div div': {
      background: theme.palette.secondary.main,
      padding: '8px 16px',
      borderRadius: '30px',
      position:'absolute',
      left:0,
      right:0,
      margin: 'auto',
      bottom: 0,
      zIndex: 2,
      color: 'white',
      fontWeight: '600',
    }
  }
});

class OnboardFirstWings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstWings: []
    };
  }

  componentDidMount () {
    AlgoliaService.setAlgoliaKey(this.props.commonStore.algoliaKey);
    this.fetchFirstWings();

    observe(this.props.commonStore, 'algoliaKey', (change) => {
      AlgoliaService.setAlgoliaKey(this.props.commonStore.algoliaKey);
      this.fetchFirstWings();
    });
  }

  fetchFirstWings = () => {
    AlgoliaService.fetchHits('type:hashtag AND hashtags.tag:#Wings', null, null, null)
    .then(content => {
      if(content) {
        this.setState({firstWings: content.hits});
      }
    })
  }

  handleAddWing = (e, tag) => {
    e.preventDefault();

    this.props.handleAddWing(e, {tag: tag});
  }

  render() {
    const { record } = this.props.recordStore.values;
    const {classes} = this.props;
    const { firstWings } = this.state;

    return (
      <ul className={classes.firstWingsList} >
        {firstWings.length > 0 && firstWings.map((hashtag, i) => {
          return (
            <li onClick={(e) => { this.handleAddWing(e, hashtag.tag) }} className={classes.firstWing} key={i} >
              <div>
                <img src={hashtag.picture.url} alt="Wing picture" />
                <div>
                  <span>
                    {hashtag.name}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }
}

export default inject('commonStore', 'recordStore')(
  observer(
    withStyles(styles)(OnboardFirstWings)
  )
);
