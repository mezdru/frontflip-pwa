import React from 'react';
import { Typography, withStyles, Grid } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { observe } from 'mobx';
import ActivityCard from './ActivityCard';
import { withProfileManagement } from '../../hoc/profile/withProfileManagement';

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
        this.getClapHistory();
      })
    });
  }

  componentWillUnmount() {
    this.state.observer();
  }

  getClapHistory = () => {
    this.props.clapStore.setCurrentRecordId(this.props.profileContext.getProp('_id'));
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

    return (
      <>
        <Typography variant="h3" style={{ textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.85)' }}>
          Activity History
        </Typography>

        {lastClapHistory && lastClapHistory.length > 0 && lastClapHistory.map((clap, index) => {
          if (clap.recipient === profileContext.getProp('_id') && profileContext.isWingsDisplayed(clap.hashtag._id || clap.hashtag)) {
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
          }
          return null;
        })}

        {!lastClapHistory || lastClapHistory.length === 0 && (
          <Grid item container xs={12} className={classes.activity} >
            Here will appears the history of the activities link to your profile.
          </Grid>
        )}

      </>
    );
  }
}

export default inject('recordStore', 'clapStore', 'commonStore', 'organisationStore')(
  observer(
    withStyles(styles)( withProfileManagement(ProfileClapHistory))
  )
)
