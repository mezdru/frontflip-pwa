import React from 'react'
import {withStyles, Hidden} from '@material-ui/core';
import {inject, observer} from "mobx-react";
import classNames from 'classnames';
import {observe} from 'mobx';

import AlgoliaService from '../../../services/algolia.service.js';
import {styles} from './OnboardFirstWings.css';
import TransparentGradientBox from "../../utils/fields/TransparentGradientBox";
import CarouselArrows from "../../utils/buttons/CarouselArrows";
import ProfileService from '../../../services/profile.service.js';

let interval;
let interval2;

class OnboardFirstWings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstWings: [],
      observer: ()=>{},
      recordObserver:  ()=>{},
      scrollableClass: Math.floor(Math.random() * 99999),
      animationInProgress: false,
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
      if(content && !this.state.animationInProgress) this.setState({firstWings: content.hits});
      })
  }

  handleAddWing = (e, tag, i) => {
    let elt = e.currentTarget;

    this.setState({animationInProgress: true}, () => {
      elt.style.setProperty('background', this.props.theme.palette.secondary.main, 'important');
      elt.style.setProperty('color', 'white');
      elt.style.animation = 'suggestionOut 450ms ease-out 0ms 1 forwards';
      this.props.handleAddWing(e, {tag: tag});
  
      setTimeout(() => {
        this.reduceElt(elt)
        .then(() => {
          this.setState({animationInProgress: false});
        })
      }, 450)
    })

  }

  getFirstWingsStyle = (index, theme) => {
    let style = {};
    style.background = 'white';
    style.color = theme.palette.primary.main;
    style.display = 'inline-block';
    return style;
  }

  shouldDisplaySuggestion = (tag) => (this.props.recordStore.values.record.hashtags && !this.props.recordStore.values.record.hashtags.some(hashtag => hashtag.tag === tag));

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

  handleMouseDown = (e) => {
    var elt = e.currentTarget;
    elt.style.transition = 'none';
    elt.style.setProperty('background', this.props.theme.palette.secondary.main, 'important');
    elt.style.setProperty('color', 'white');
  }

  handleMouseUp = (e) => {
    var elt = e.currentTarget;
    elt.style.transition = 'none';
    elt.style.setProperty('background', '');
    elt.style.setProperty('color', this.props.theme.palette.primary.dark);
  }

  reduceElt = async (elt) => {
    var initWidth = elt.offsetWidth;
    return new Promise((resolve, reject) => {
      var currentInterval = setInterval(() => {
        initWidth = Math.max(0, initWidth-2);
        elt.style.width = initWidth +'px' ;
        if(elt.style.width === 0+'px' || !elt.style.width){
          clearInterval(currentInterval);
          resolve();
        }
      }, 5);
    });
  }

  render() {
    const {classes, theme} = this.props;
    const {locale} = this.props.commonStore;
    const { firstWings, scrollableClass } = this.state;
    
    return (
      <div style={{position: 'relative'}}>
        <Hidden smDown>
          <CarouselArrows scrollPosition={'scrollLeft'} onMouseDown={this.scrollLeft} onMouseUp={this.scrollStop}  variant="outlined"/>
          <CarouselArrows scrollPosition={'scrollRight'} onMouseDown={this.scrollRight} onMouseUp={this.scrollStop} variant="outlined"/>
        </Hidden>
        <Hidden xsDown>
          <TransparentGradientBox position='left'/>
          <TransparentGradientBox position='right'/>
        </Hidden>
        <ul className={classNames(classes.firstWingsList, ''+scrollableClass)} >
          {firstWings.length > 0 && firstWings.map((hashtag, i) => {
            if(!this.shouldDisplaySuggestion(hashtag.tag)) return null;
            let displayedName = (hashtag.name_translated ? (hashtag.name_translated[locale] || hashtag.name_translated['en-UK']) || hashtag.name || hashtag.tag : hashtag.name || hashtag.tag)
            return (
              <li onClick={(e) => { this.handleAddWing(e, hashtag.tag, i) }} className={classes.firstWing} key={hashtag._id || hashtag.objectID}
                  style={this.getFirstWingsStyle(i, theme)}
                  onMouseUp={(e) => this.handleMouseUp(e)}
                  onMouseDown={(e) => this.handleMouseDown(e)}
              >
                <div>
                  <img src={hashtag.picture.url || ProfileService.getPicturePath(hashtag.picture)} alt="Soft Wing" />
                  <div>
                    <span>
                      {displayedName}
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
