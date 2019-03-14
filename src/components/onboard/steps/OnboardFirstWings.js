import React from 'react'
import { withStyles, Hidden, Button } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import classNames from 'classnames';
import { observe } from 'mobx';
import AlgoliaService from '../../../services/algolia.service.js';
import { ArrowLeft, ArrowRight } from '@material-ui/icons';

let interval;
let interval2;

const styles = theme => ({
  firstWingsList: {
    listStyleType: 'none',
    padding: 8,
    paddingTop: 0,
    position: 'relative',
    left:0,
    right:0,
    margin: 'auto',
    width: 'calc(100% - 16px)',
    whiteSpace: 'nowrap',
    overflowX: 'auto',
    scrollbarWidth: 'thin',
    scrollbarColor:  'rgba(0, 0, 0, 0.26) transparent',
  },
  firstWing: {
    textAlign: 'center',
    cursor: 'pointer',
    display: 'inline-block',
    width: 169,
    height: 169,
    [theme.breakpoints.down('sm')]: {
      width: 130,
      height: 130,
    },
    overflow: 'hidden',
    padding: 16,
    margin: 8,
    WebkitTransition: 'all .6s ease-in-out',
    MozTransition: 'all .6s ease-in-out',
    OTransition: 'all .6s ease-in-out',
    transition: 'all .6s ease-in-out',
    borderRadius: 30,
    '& img': {
      width: 145,
      height: 145,
      borderRadius: 75,
      [theme.breakpoints.down('sm')]: {
        width: 100,
        height: 100,
        borderRadius: 50,
      },
      outline: 'none',
    },
    '& div': {
      position: 'relative',
      height: '100%',
      width: '100%',
    },
    '& div div': {
      position:'absolute',
      left:0,
      right:0,
      margin: 'auto',
      bottom: 0,
      zIndex: 2,
      fontWeight: '600',
      height: 'initial',
    }
  },
  scrollLeft: {
    left: -64,
  },
  scrollRight: {
    right: -64,
  },
  scrollButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    border: 'none',
    color: 'rgba(0, 0, 0, 0.26)',
    fontSize: 45,
    padding: 0,
    overflow: 'hidden',
    minWidth: 0,
    width: 56,
  }
});

class OnboardFirstWings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstWings: [],
      firstWingsSelected: [],
      observer: ()=>{}
    };
  }

  componentDidMount () {
    AlgoliaService.setAlgoliaKey(this.props.commonStore.algoliaKey);
    this.fetchFirstWings();

    this.setState({observer: observe(this.props.commonStore, 'algoliaKey', (change) => {
      AlgoliaService.setAlgoliaKey(this.props.commonStore.algoliaKey);
      this.fetchFirstWings();
    })});
  }

  componentWillUnmount() {
    this.state.observer();
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

  scrollRight = () => {
    interval = window.setInterval(function() {
      window.document.getElementsByClassName('scrollable')[0].scrollLeft += 2;
    }, 5);
  }

  scrollLeft = () => {
    interval2 = window.setInterval(function() {
      window.document.getElementsByClassName('scrollable')[0].scrollLeft -= 2;
    }, 5);
  }

  scrollStop =() => {
    clearInterval(interval);
    clearInterval(interval2);
  }

  render() {
    const {classes, theme} = this.props;
    const { firstWings } = this.state;

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
        <ul className={classNames(classes.firstWingsList, 'scrollable')} >
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
