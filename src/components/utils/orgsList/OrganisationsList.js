import React from 'react';
import { Avatar, withStyles, Typography, Button, ListItem, List } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import Logo from '../logo/Logo';
import { Link } from 'react-router-dom';
const defaultLogo = 'https://pbs.twimg.com/profile_images/981455890342694912/fXaclV2Y_400x400.jpg';

const style = theme => ({
  orgItem: {
    position: 'relative',
    display: 'inline-block',
    width: '33%',
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
    margin: 'auto'
  },
  itemName: {
    textTransform: 'uppercase',
    fontSize: '0.675rem',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    marginTop: 8,
    color: 'black'
  },
});

class OrganisationsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    this.props.organisationStore.getCurrentUserOrganisations().then(() => {
      this.forceUpdate();
    });
  }

  render() {
    const { currentUserOrganisations, orgTag } = this.props.organisationStore.values;
    const { locale } = this.props.commonStore;
    const { classes } = this.props;

    return (
      <List className={classes.orgsContainer}>
        {currentUserOrganisations.map((org, i) => {
          if (org.tag !== orgTag) {
            return (
              <ListItem button component={Link} to={'/' + locale + '/' + org.tag} key={org._id} className={classes.orgItem}>
                <Logo type={'smallOrg'} alt={org.name} src={org.logo.url || defaultLogo} className={classes.itemLogo} />
                <div className={classes.itemName} >{org.name}</div>
              </ListItem>
            );
          }
        })}
      </List>
    )
  }
}

export default inject('organisationStore', 'commonStore')(
  observer(
    withStyles(style, { withTheme: true })(OrganisationsList)
  )
);