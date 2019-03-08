import React from 'react'
import { withStyles } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import { observe } from 'mobx';
import AlgoliaService from '../../../services/algolia.service.js';

const styles = theme => ({
  firstWingsList: {
    listStyleType: 'none',
    padding: 8,
    position: 'relative',
    left:0,
    right:0,
    margin: 'auto',
    width: 'calc(100% - 16px)',
    whiteSpace: 'nowrap',
    overflowX: 'auto',
  },
  firstWing: {
    textAlign: 'center',
    cursor: 'pointer',
    display: 'inline-block',
    width: 130,
    height: 124,
    overflow: 'hidden',
    padding: 16,
    margin: 8,
    WebkitTransition: 'all .6s ease-in-out',
    MozTransition: 'all .6s ease-in-out',
    OTransition: 'all .6s ease-in-out',
    transition: 'all .6s ease-in-out',
    borderRadius: 30,
    '& img': {
      width: 100,
      height: 100,
      borderRadius: 50,
      outline: 'none',
    },
    '& div': {
      position: 'relative',
    },
    '& div div': {
      borderRadius: '30px',
      position:'relative',
      left:0,
      right:0,
      margin: 'auto',
      bottom: 0,
      zIndex: 2,
      fontWeight: '600',
    }
  }
});

class OnboardFirstWings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstWings: [],
      firstWingsSelected: [],
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
        this.setState({firstWings: content.hits, firstWingsSelected: new Array(content.hits.length)});
      }
    })
  }

  handleAddWing = (e, tag, i) => {
    this.updateSelectedWings(i, this.state.firstWingsSelected[i]);
    this.props.handleAddWing(e, {tag: tag});
  }

  updateSelectedWings = (i, selected) => {
    let state = this.state.firstWingsSelected;
    state[i] = !selected;
    this.setState({firstWingsSelected: state});
  }

  getFirstWingsStyle = (index, theme) => {
    let style = {};
    style.background = (this.state.firstWingsSelected[index] ? theme.palette.secondary.dark : 'white');
    style.color = (this.state.firstWingsSelected[index] ? 'white' : theme.palette.secondary.main);
    style.display = (this.state.firstWingsSelected[index] ? 'none' : 'inline-block');
    return style;
  }

  shouldDisplaySuggestion = (tag) => (!this.props.recordStore.values.record.hashtags.some(hashtag => hashtag.tag === tag));

  render() {
    const { record } = this.props.recordStore.values;
    const {classes, theme} = this.props;
    const { firstWings, firstWingsSelected } = this.state;

    return (
      <ul className={classes.firstWingsList} >
        {firstWings.length > 0 && firstWings.map((hashtag, i) => {
          if(!this.shouldDisplaySuggestion(hashtag.tag)) return null;
          return (
            <li onClick={(e) => { this.handleAddWing(e, hashtag.tag, i) }} className={classes.firstWing} key={i} 
              style={this.getFirstWingsStyle(i, theme)} >
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
    withStyles(styles, {withTheme: true})(OnboardFirstWings)
  )
);
