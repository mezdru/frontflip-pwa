import React from 'react'
import { withStyles, Button, Hidden, Typography } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import classNames from 'classnames';
import { observe } from 'mobx';
import Wings from '../utils/wing/Wing';
import ProfileService from '../../services/profile.service';
import SuggestionsService from '../../services/suggestions.service';
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
      suggestions: [],
      bank: [],
      renderComponent: false,
      shouldUpdate: false,
      observer: ()=> {},
      scrollableClass: Math.floor(Math.random() * 99999)
    };
  }

  componentDidMount() {
    SuggestionsService.init(this.props.algoliaKey)
    .then(()=> {
      SuggestionsService.makeInitialSuggestions()
      .then(()=> {
        this.setState({suggestions: SuggestionsService.getCurrentSuggestions(), renderComponent: true});
      })
    });

    this.setState({observer: observe(this.props.commonStore, 'algoliaKey', (change) => {
      SuggestionsService.init(this.props.algoliaKey)
      .then(()=> {
        SuggestionsService.makeInitialSuggestions()
        .then(()=> {
          this.setState({suggestions: SuggestionsService.getCurrentSuggestions(), renderComponent: true});
        })
      });
    })});
  }

  componentWillUnmount() {
    this.state.observer();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({suggestions: []}, () => {
      this.syncBank(null)
      .then(() => {
        this.initSuggestions(nextProps.wingsFamily)
          .then(() => {})
      });
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ( (nextState.shouldUpdate || (!this.state.renderComponent && nextState.renderComponent)) && !nextState.animationInProgress ) {
      this.setState({shouldUpdate: false});
      return true;
    }
    return false;
  }

  handleSelectSuggestion = (e, element, index) => {
    SuggestionsService.updateSuggestions(element, index);

    var elt = e.currentTarget;
    // elt.style.opacity = 0;
    // elt.style.padding = 0;
    // elt.style.width = 0;
    // elt.style.fontSize = '0rem';
    // elt.style.overflow = 'hidden';
    elt.style.background = this.props.theme.palette.secondary.main;
    elt.style.animationDelay = '0.3s';
    elt.style.animation = 'suggestionOut 1s ease-out';
    elt.style.animationFillMode = 'forwards';

    this.setState({animationInProgress: true}, () => {
      setTimeout(() => {this.setState({animationInProgress: false}, () => {
        this.scrollToSuggestion(elt.offsetLeft);
        this.props.handleAddWing(e, element).then(() => {
          this.setState({suggestions: SuggestionsService.getCurrentSuggestions()});
          })
        })
      }, 1000);
    })
    
  }

  shouldDisplaySuggestion = (tag) => (!this.props.recordStore.values.record.hashtags.some(hashtag => hashtag.tag === tag));

  getDisplayedName = (hit) => (hit.name_translated ? (hit.name_translated[this.state.locale] || hit.name_translated['en-UK']) || hit.name || hit.tag : hit.name || hit.tag);

  renderWing = (classes, hit, i) => {
    return (
      <li key={i} className={classes.suggestion} style={{animationDelay: (i*0.05) +'s'}} id={hit.tag}>
        <Wings  src={ProfileService.getPicturePath(hit.picture) || defaultHashtagPicture}
          label={ProfileService.htmlDecode(this.getDisplayedName(hit))}
          onClick={(e) => this.handleSelectSuggestion(e, { name: hit.name || hit.tag, tag: hit.tag }, i)}
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

  render() {
    const { classes } = this.props;
    const { suggestions, scrollableClass } = this.state;
    return (
      <div>
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
