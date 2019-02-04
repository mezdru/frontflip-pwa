import React from 'react'
import { Grid, withStyles } from '@material-ui/core';
import Banner from '../components/utils/banner/Banner';
import Card from '../components/card/CardProfile';
import MainAlgoliaSearch from '../components/algolia/MainAlgoliaSearch';
import { inject, observer } from "mobx-react";
import Header from '../components/header/Header';
import { Redirect } from "react-router-dom";

const styles = {

};

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locale: this.props.commonStore.getCookie('locale') || this.props.commonStore.locale
    };
  }

  render() {
    const { locale } = this.state;
    const { organisation } = this.props.organisationStore.values;
    let profileTag = (this.props.match.params ? this.props.match.params.profileTag : null);
    let redirecTo = null;

    if (profileTag && profileTag.charAt(0) !== '@') redirecTo = '/' + locale + '/' + organisation.tag;

    if (redirecTo) return (<Redirect to={redirecTo} />);

    return (
      <div>
        <Header />
        <main>
          <Grid container direction={'column'} alignItems={'center'}>
            <MainAlgoliaSearch HitComponent={Card} profileTag={profileTag} />
          </Grid>
        </main>
      </div>
    );
  }
}

export default inject('commonStore', 'organisationStore', 'authStore', 'recordStore', 'userStore')(
  observer(
    withStyles(styles)(Search)
  )
);
