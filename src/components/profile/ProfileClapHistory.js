import React from 'react';
import { Typography, withStyles, Grid } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { observe } from 'mobx';
import ActivityCard from './ActivityCard';
import { withProfileManagement } from '../../hoc/profile/withProfileManagement';
import { FormattedMessage } from 'react-intl';

const styles = {
  activity: {
    background: 'rgba(255, 255, 255, 0.85)',
    borderRadius: '0px 4px 4px 4px',
    marginTop: 16,
    padding: 8
  }
};

class ProfileClapHistory extends React.Component {
  state = {
    clapHistory: [],
    observer: () => { }
  }

  componentDidMount() {
    this.getClapHistory();

    this.setState({
      observer: observe(this.props.recordStore.values, 'displayedRecord', (change) => {
        this.getClapHistory(change.newValue ? change.newValue._id : null);
      })
    });
  }

  componentWillUnmount() {
    this.state.observer();
  }

  getClapHistory = (recordId) => {
    let currentId = recordId || (this.props.recordStore.values.displayedRecord ? this.props.recordStore.values.displayedRecord._id : null);
    if(!currentId) return this.setState({clapHistory: []});
    this.props.clapStore.setCurrentRecordId(currentId);
    this.props.clapStore.getClapHistory()
      .then(clapHistory => {
        this.setState({ clapHistory: JSON.parse(JSON.stringify(clapHistory)) });
      }).catch(e => { return; });
  }

  render() {
    const { classes, profileContext } = this.props;
    const { clapHistory } = this.state;
    const { locale } = this.props.commonStore;
    const { organisation } = this.props.organisationStore.values;
    const lastClapHistory = clapHistory.slice(0, 10);
    let clapsDisplayed = 0;

    return (
      <>
        <Typography variant="h3" style={{ textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.85)' }}>
          <FormattedMessage id="profile.activity.title" />
        </Typography>

        {lastClapHistory && lastClapHistory.length > 0 && lastClapHistory.map((clap, index) => {
          if (clap.recipient === profileContext.getProp('_id') && profileContext.isWingsDisplayed(clap.hashtag._id || clap.hashtag)) {
            clapsDisplayed ++;
            return <ActivityCard
              key={clap._id}
              picture={clap.giver.picture ? clap.giver.picture.url : null}
              hashtag={clap.hashtag}
              authorName={clap.giver.name}
              message={clap.message}
              given={clap.given}
              created={clap.created}
              locale={this.props.commonStore.locale}
              link={'/' + locale + '/' + organisation.tag + '/' + clap.giver.tag}
            />
          }else return null;
        })}

        {(!lastClapHistory || lastClapHistory.length === 0 || clapsDisplayed === 0) ? (
          <Grid item container xs={12} className={classes.activity} >
            <FormattedMessage id="profile.activity.empty" />
          </Grid>
        ): null}

      </>
    );
  }
}

export default inject('recordStore', 'clapStore', 'commonStore', 'organisationStore')(
  observer(
    withStyles(styles)( withProfileManagement(ProfileClapHistory))
  )
)
