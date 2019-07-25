import React from 'react';
import { Typography, withStyles, Grid } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { observe } from 'mobx';
import ActivityCard from './ActivityCard';

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
      observer: observe(this.props.recordStore.values, 'otherRecord', (change) => {
        this.getClapHistory();
      })
    });
  }

  componentWillUnmount() {
    this.state.observer();
  }

  getClapHistory = () => {
    this.props.clapStore.setCurrentRecordId(this.props.recordId || this.props.recordStore.values.otherRecord._id);
    this.props.clapStore.getClapHistory()
      .then(clapHistory => {
        this.setState({ clapHistory: JSON.parse(JSON.stringify(clapHistory)) });
      }).catch(e => console.log(e));
  }

  render() {
    const { classes } = this.props;
    const { clapHistory } = this.state;

    const lastClapHistory = clapHistory.slice(0, 10);

    return (
      <div>
        <Typography variant="h3" style={{ textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.85)' }}>
          Activity History
        </Typography>

        {lastClapHistory && lastClapHistory.length > 0 && lastClapHistory.map((clap, index) =>
          <ActivityCard 
            picture={clap.giver.picture ? clap.giver.picture.url : null}
            hashtag={clap.hashtag}
            authorName={clap.giver.name}
            message={clap.message}
            given={clap.given}
            created={clap.created}
            locale={this.props.commonStore.locale}
          />
        )}

        {!lastClapHistory || lastClapHistory.length === 0 && (
          <Grid item container xs={12} className={classes.activity} >
            Here will appears the history of the activities link to your profile.
          </Grid>
        )}

      </div>
    );
  }
}

export default inject('recordStore', 'clapStore', 'commonStore')(
  observer(
    withStyles(styles)(ProfileClapHistory)
  )
)
