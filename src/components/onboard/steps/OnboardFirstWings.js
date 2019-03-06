import React from 'react'
import { withStyles } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import { observe } from 'mobx';
import AlgoliaService from '../../../services/algolia.service.js';
import { grey } from '@material-ui/core/colors';

const styles = theme => ({
  firstWingsList: {
    listStyleType: 'none',
    padding: 0,
    paddingBottom: 8,
    marginBottom: 0,
    display: 'grid',
    gridAutoFlow: 'column dense',
    gridTemplateRows: 'repeat(3, auto)',
    gridTemplateColumns: 'min-content',
    gridGap: '16px',
    width: '584px',
    position: 'relative',
    left:0,
    right:0,
    margin: 'auto',
    marginTop: 16,
  },
  firstWing: {
    textAlign: 'center',
    cursor: 'pointer',
    display: 'inline-block',
    width: 150,
    padding: 16,
    background: 'rgba(50,50,50,.05)',
    WebkitTransition: 'all .6s ease-in-out',
    MozTransition: 'all .6s ease-in-out',
    OTransition: 'all .6s ease-in-out',
    transition: 'all .6s ease-in-out',
    borderRadius: 30,
    '& img': {
      width: 150,
      height: 150,
      borderRadius: 75,
      outline: 'none',
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

  render() {
    const { record } = this.props.recordStore.values;
    const {classes, theme} = this.props;
    const { firstWings, firstWingsSelected } = this.state;
    console.log(this.state);

    return (
      <ul className={classes.firstWingsList} >
        {firstWings.length > 0 && firstWings.map((hashtag, i) => {
          return (
            <li onClick={(e) => { this.handleAddWing(e, hashtag.tag, i) }} className={classes.firstWing} key={i} 
              style= {{
                background: (firstWingsSelected[i] ? theme.palette.secondary.dark : 'rgba(50,50,50,0.05)')
              }}
            >
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
