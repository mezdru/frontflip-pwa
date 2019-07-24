import React from 'react';
import { withStyles, Grid, Button, IconButton, Hidden } from '@material-ui/core';
import { FilterList, Clear } from '@material-ui/icons';
import classNames from 'classnames';
import MenuDropdown from '../utils/menu/MenuDropdown';
import { inject, observer } from 'mobx-react';
import UrlService from '../../services/url.service.js';

const styles = theme => ({
  button: {
    height: 40,
    marginLeft: 16,
  },
  returnButton: {
    width: 40,
    background: 'white',
    color: theme.palette.secondary.main,
    opacity: 0.7,
    transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backgroundColor: 'white',
      opacity: 1,
    }
  }
});

class ProfileActions extends React.PureComponent {

  buildAction = () => {
    let locale = this.props.commonStore.locale;
    let orgTag = this.props.organisationStore.values.organisation.tag;

    return [
      { href: UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/cover/id/' + this.props.recordId, orgTag), textId: 'profile.updateCover' },
      { href: '/' + locale + '/' + orgTag + '/onboard/intro/edit/' + this.props.recordId, textId: 'profile.editIntro' },
      { href: '/' + locale + '/' + orgTag + '/onboard/contacts/edit/' + this.props.recordId, textId: 'profile.editContacts' },
      { href: UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/about/id/' + this.props.recordId, orgTag), textId: 'profile.editAboutMe' },
      { href: UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/admin/record/delete/' + this.props.recordId, orgTag), textId: 'delete profile' }
    ];
  }

  render() {
    const { canPropose, canFilter, canEdit, classes } = this.props;
    const actions = this.buildAction();

    return (
      <>
        <Hidden mdDown>
          {canPropose && (
            <Grid item>
              <Button className={classes.button} color="secondary" disabled >Propose Wings</Button>
            </Grid>
          )}

          {canFilter && (
            <Grid item>
              <Button className={classes.button} disabled>Filter <FilterList /> </Button>
            </Grid>
          )}

          {canEdit && (
            <Grid item>
              <MenuDropdown actions={actions} />
            </Grid>
          )}
        </Hidden>


        <Grid item>
          <IconButton className={classNames(classes.button, classes.returnButton)} onClick={this.props.handleClose} >
            <Clear />
          </IconButton>
        </Grid>
      </>
    )
  }
}

export default inject('commonStore', 'organisationStore')(
  observer(
    withStyles(styles)(ProfileActions)
  )
);
