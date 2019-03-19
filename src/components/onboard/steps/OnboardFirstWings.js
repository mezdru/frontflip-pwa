import React from 'react'
import { withStyles, Hidden, Button } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import classNames from 'classnames';
import { observe } from 'mobx';
import { ArrowLeft, ArrowRight } from '@material-ui/icons';

import AlgoliaService from '../../../services/algolia.service.js';
import {styles} from './OnboardFirstWings.css';

let interval;
let interval2;

class OnboardFirstWings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstWings: [],
      firstWingsSelected: [],
      observer: ()=>{},
      recordObserver:  ()=>{},
      scrollableClass: Math.floor(Math.random() * 99999)
    };
  }

  componentDidMount () {
    AlgoliaService.setAlgoliaKey(this.props.commonStore.algoliaKey);
    this.fetchFirstWings();

    this.setState({observer: observe(this.props.commonStore, 'algoliaKey', (change) => {
      AlgoliaService.setAlgoliaKey(this.props.commonStore.algoliaKey);
      this.fetchFirstWings();
    })});

    this.setState({recordObserver: observe(this.props.recordStore.values, 'record', (change) => {
      this.fetchFirstWings();
    })});
  }

  componentWillUnmount() {
    this.state.observer();
    this.state.recordObserver();
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
    style.color = (this.state.firstWingsSelected[index] ? 'white' : theme.palette.primary.main);
    style.display = (this.state.firstWingsSelected[index] ? 'none' : 'inline-block');
    return style;
  }

  shouldDisplaySuggestion = (tag) => (!this.props.recordStore.values.record.hashtags.some(hashtag => hashtag.tag === tag));

  scrollRight = () => {
    interval = window.setInterval(function() {
      window.document.getElementsByClassName(this.state.scrollableClass)[0].scrollLeft += 2;
    }.bind(this), 5);
  }

  scrollLeft = () => {
    interval2 = window.setInterval(function() {
      window.document.getElementsByClassName(this.state.scrollableClass)[0].scrollLeft -= 2;
    }.bind(this), 5);
  }

  scrollStop =() => {
    clearInterval(interval);
    clearInterval(interval2);
  }

  render() {
    const {classes, theme} = this.props;
    const { firstWings, scrollableClass } = this.state;

    return (
      <div style={{position: 'relative'}}>
        <Hidden smDown>
          <Button className={classNames(classes.scrollLeft, classes.scrollButton)} onMouseDown={this.scrollLeft} onMouseUp={this.scrollStop} variant="outlined">
            <ArrowLeft fontSize="inherit" />
          </Button>
          <Button className={classNames(classes.scrollRight, classes.scrollButton)} onMouseDown={this.scrollRight} onMouseUp={this.scrollStop} variant="outlined">
            <ArrowRight fontSize="inherit" />
          </Button>
        </Hidden>
        <ul className={classNames(classes.firstWingsList, ''+scrollableClass)} >
          {firstWings.length > 0 && firstWings.map((hashtag, i) => {
            if(!this.shouldDisplaySuggestion(hashtag.tag)) return null;
            return (
              <li onClick={(e) => { this.handleAddWing(e, hashtag.tag, i) }} className={classes.firstWing} key={i} 
                style={this.getFirstWingsStyle(i, theme)} >
                <div>
                  <img src={hashtag.picture.url} alt="Soft Wing" />
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
      </div>
    );
  }
}

export default inject('commonStore', 'recordStore')(
  observer(
    withStyles(styles, {withTheme: true})(OnboardFirstWings)
  )
);
