import React from 'react';
import { withStyles, ListItem, List, CircularProgress } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import Logo from '../logo/Logo';
import { Link } from 'react-router-dom';
import defaultLogo from '../../../resources/images/wingzy_512.png';

const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

const style = theme => ({
  orgItem: {
    position: 'relative',
    display: 'inline-block',
    width: '33.33%',
    textAlign: 'center',
    padding: 8,
  },
  orgsContainer: {
    position: 'relative',
    width: '100%',
    listStyleType: 'none',
    textAlign: 'left',
  },
  itemLogo: {
    position: 'relative',
    left: 0,
    right: 0,
    margin: 'auto',
    border: '2px solid white',
  },
  itemName: {
    textTransform: 'uppercase',
    fontSize: '0.675rem',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    marginTop: 8,
    color: 'white'
  },
  circularProgressContainer: {
    position: 'relative',
    width: '100%',
    textAlign: 'center'
  }
});

class OrganisationsList extends React.Component {

  render() {
    const { organisations, currentOrganisation } = this.props.orgStore;
    const { currentUser } = this.props.userStore;
    const { locale } = this.props.commonStore;
    const { classes } = this.props;

    let currentUserOrganisations = organisations.filter(org => currentUser.orgsAndRecords.find(oar => (oar.organisation._id || oar.organisation) === org._id));

    return (
      <List className={classes.orgsContainer}>
        {currentUserOrganisations.map((org, i) => {
          if (currentOrganisation && org.tag === currentOrganisation.tag) return null;
          return (
            <ListItem button component={"a"} href={'/' + locale + '/' + org.tag} key={org._id} className={classes.orgItem} onClick={this.props.onClick}>
              <Logo type={'smallOrg'} alt={entities.decode(org.name)} src={(org.logo ? org.logo.url : null) || defaultLogo} className={classes.itemLogo} />
              <div className={classes.itemName} >{entities.decode(org.name)}</div>
            </ListItem>
          );
        })}
        {(currentUserOrganisations.length === 0) && (
          <div className={classes.circularProgressContainer} >
            <CircularProgress />
          </div>
        )}
      </List>
    );
  }
}

export default inject('orgStore', 'commonStore', 'userStore')(
  observer(
    withStyles(style, { withTheme: true })(OrganisationsList)
  )
);
