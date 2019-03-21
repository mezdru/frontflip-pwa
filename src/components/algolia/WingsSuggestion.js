import React from 'react'
import { withStyles, Button, Hidden, Typography } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import classNames from 'classnames';
import { observe } from 'mobx';
import Wings from '../utils/wing/Wing';
import ProfileService from '../../services/profile.service';
import defaultHashtagPicture from '../../resources/images/placeholder_hashtag.png';
import { styles } from './WingsSuggestion.css.js';
import { ArrowLeft, ArrowRight } from '@material-ui/icons';
import './WingsSuggestion.css';
import {FormattedMessage} from "react-intl";

let interval;
let interval2;

class WingsSuggestions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: this.props.SuggestionsService.getCurrentSuggestions(),
      bank: [],
      renderComponent: false,
      shouldUpdate: false,
      observer: ()=> {},
      scrollableClass: Math.floor(Math.random() * 99999),
      onlyViewport: true,
      offsetSuggestionsIndex: 0,
    };
  }

  componentDidMount() {

    observe(this.props.SuggestionsService, '_randomNumber', (change) => {
      this.setState({suggestions: this.props.SuggestionsService.getCurrentSuggestions(), shouldUpdate: true});
    });
  }

  componentWillUnmount() {
    this.state.observer();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ( (nextState.shouldUpdate || (!this.state.renderComponent && nextState.renderComponent)) && !nextState.animationInProgress ) {
      this.setState({shouldUpdate: false});
      return true;
    }
    return false;
  }

  handleSelectSuggestion = (e, element, index) => {
    this.props.handleAddWing(e, element);
    this.props.SuggestionsService.updateSuggestions(element, index);

    var elt = e.currentTarget;
    elt.style.setProperty('background', this.props.theme.palette.secondary.main, 'important');
    elt.style.setProperty('color', 'white');
    elt.style.animation = 'suggestionOut 450ms ease-out 0ms 1 forwards';

    this.setState({animationInProgress: true, offsetSuggestionsIndex: this.state.suggestions.length}, () => {
      setTimeout(() => {this.setState({animationInProgress: false}, () => {
        var liElt = elt.parentNode;
        this.reduceElt(liElt)
        .then(() => {
          // this.scrollToSuggestion(offsetToScroll);
          this.setState({suggestions: this.props.SuggestionsService.getCurrentSuggestions()});
        });
        })
      }, 450);
    })
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

  shouldDisplaySuggestion = (tag) => (!this.props.recordStore.values.record.hashtags.some(hashtag => hashtag.tag === tag));

  getDisplayedName = (hit) => (hit.name_translated ? (hit.name_translated[this.state.locale] || hit.name_translated['en-UK']) || hit.name || hit.tag : hit.name || hit.tag);

  renderWing = (classes, hit, i) => {
    return (
      <li key={i} className={classes.suggestion} style={{animationDelay: ((i-this.state.offsetSuggestionsIndex.offset)*0.05) +'s'}} id={hit.tag}>
        <Wings  src={ProfileService.getPicturePath(hit.picture) || defaultHashtagPicture}
          label={ProfileService.htmlDecode(this.getDisplayedName(hit))}
          onClick={(e) => this.handleSelectSuggestion(e, { name: hit.name || hit.tag, tag: hit.tag }, i)}
          onMouseDown={(e) => this.handleMouseDown(e)}
          onMouseUp={(e) => this.handleMouseUp(e)}
          onBlur={(e) => this.handleMouseUp(e)}
          className={'suggestionWing'} />
      </li>
    );
  }

  renderWingsList = (suggestions, classes, isEven) => {
    return (
      <ul className={classNames(classes.suggestionList, "scrollX")}>
      {suggestions && suggestions.map((hit, i) => {
        return (hit && this.shouldDisplaySuggestion(hit.tag) && i%2 === (isEven ? 0 : 1)) ? this.renderWing(classes, hit, i) : null;
      })}
    </ul>
    );
  }

  scrollToSuggestion = (scrollLeft) => {
    var elt = window.document.getElementsByClassName(this.state.scrollableClass)[0];
    var initialScrollLeft = elt.scrollLeft
    var suggestionInterval = window.setInterval(function() {
      if(initialScrollLeft > scrollLeft) {
        var scroll1 = elt.scrollLeft;
        elt.scrollLeft -= 4;
        var scroll2 = elt.scrollLeft;
        if((elt.scrollLeft <= scrollLeft) || (elt.scrollLeft === elt.scrollWidth) || scroll1 === scroll2) clearInterval(suggestionInterval);
      } else {
        var scroll1 = elt.scrollLeft;
        elt.scrollLeft += 4;
        var scroll2 = elt.scrollLeft;
        if((elt.scrollLeft >= scrollLeft) || (elt.scrollLeft === elt.scrollWidth) || scroll2 === scroll1) clearInterval(suggestionInterval);
      }
    }.bind(this), 5);
  }

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

  /**
   * Check if an element is in viewport
   *
   * @param {number} [offset]
   * @returns {boolean}
   */
  isInViewport = (offset = 0) => {
    if (!this.elementNode) return false;
    const left = this.elementNode.getBoundingClientRect().left;
    return (left + offset) >= 0 && (left - offset) <= window.innerWidth;
  }


  render() {
    const { classes } = this.props;
    const { suggestions, scrollableClass } = this.state;

    return (
      <div ref={(el) => {this.elementNode = el}}>
        <Typography variant="subtitle2" style={{padding: 16}} ><FormattedMessage id={'wingsSuggestions'}/></Typography>

        <div style={{position:'relative', height: 126}}>
        <Hidden smDown>
          <Button className={classNames(classes.scrollLeft, classes.scrollButton)} onMouseDown={this.scrollLeft} onMouseUp={this.scrollStop} variant="outlined">
            <ArrowLeft fontSize="inherit" />
          </Button>
          <Button className={classNames(classes.scrollRight, classes.scrollButton)} onMouseDown={this.scrollRight} onMouseUp={this.scrollStop} variant="outlined">
            <ArrowRight fontSize="inherit" />
          </Button>
        </Hidden>
        <div className={classes.transparentGradientBoxLeft}></div>
        <div className={classNames(classes.suggestionsContainer, ''+scrollableClass)} >
          {this.renderWingsList(suggestions, classes, true)}
          {this.renderWingsList(suggestions, classes, false)}
        </div>
        <div className={classes.transparentGradientBoxRight}></div>
      </div>
      </div>
    );
  }
}

export default inject('commonStore', 'recordStore', 'organisationStore')(
  observer(
    withStyles(styles, {withTheme: true})(WingsSuggestions)
  )
);
