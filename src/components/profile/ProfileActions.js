import React from 'react';
import { withStyles, Grid, IconButton, ClickAwayListener } from '@material-ui/core';
import { ArrowBack, Edit } from '@material-ui/icons';
import classNames from 'classnames';
import MenuDropdown from '../utils/menu/MenuDropdown';
import { inject, observer } from 'mobx-react';
import UrlService from '../../services/url.service.js';
import { withProfileManagement } from '../../hoc/profile/withProfileManagement';

const styles = theme => ({
  button: {
    height: 40,
    marginRight: 16,
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

  state = {
    openEdit: false,
    openFilter: false
  }

  buildAction = () => {
    let locale = this.props.commonStore.locale;
    let orgTag = this.props.organisationStore.values.organisation.tag;
    let recordId = this.props.profileContext.getProp('_id');

    return [
      { href: UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/cover/id/' + recordId, orgTag), textId: 'profile.updateCover' },
      { href: '/' + locale + '/' + orgTag + '/onboard/intro/edit/' + recordId, textId: 'profile.editIntro' },
      { href: '/' + locale + '/' + orgTag + '/onboard/contacts/edit/' + recordId, textId: 'profile.editContacts' },
      { href: UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/about/id/' + recordId, orgTag), textId: 'profile.editAboutMe' },
      { href: UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/admin/record/delete/' + recordId, orgTag), textId: 'delete profile' }
    ];
  }

  buildFilters = () => {
    let filters = [];

    if(!this.props.organisationStore.values.organisation.featuredWingsFamily) return filters;

    this.props.organisationStore.values.organisation.featuredWingsFamily.forEach(featuredWingFamily => {
      filters.push({
        text: featuredWingFamily.name || featuredWingFamily,
        wingId: featuredWingFamily._id,
      });
    });

    return filters;
  }

  handleClickEdit = (e) => {
    this.setState({ openEdit: !this.state.openEdit, menuDropdownAnchor: e.currentTarget });
  }

  handleClickFilter = (e) => {
    this.setState({ openFilter: !this.state.openFilter, menuDropdownAnchor: e.currentTarget });
  }

  render() {
    const { classes } = this.props;
    const { isEditable } = this.props.profileContext;
    const { openEdit, menuDropdownAnchor } = this.state;
    const actions = this.buildAction();

    return (
      <>

        <Grid item xs={2}>
          <IconButton className={classNames(classes.button, classes.returnButton)} onClick={this.props.handleClose} >
            <ArrowBack />
          </IconButton>
        </Grid>

        <Grid container item justify="flex-end" alignContent="flex-end" xs={10}>
          {/* {canPropose && (
            <Grid item>
              <Button className={classes.button} color="secondary" disabled >Propose Wings</Button>
            </Grid>
          )} */}

          {/* <Hidden mdDown>

            {canFilter && filters.length > 0 && (
              <Grid item style={{ position: 'relative' }}>
                <Button className={classes.button} onClick={this.handleClickFilter} ><FormattedMessage id="profile.filter.title" /> <FilterList /> </Button>

                {openFilter && (
                  <ClickAwayListener onClickAway={this.handleClickFilter}>
                    <MenuDropdown actions={filters} open={openFilter} mode="filter" />
                  </ClickAwayListener>
                )}
              </Grid>
            )}

          </Hidden> */}

          {isEditable && (
            <Grid item style={{ position: 'relative' }}>
              <IconButton
                className={classNames(classes.button, classes.returnButton)}
                buttonRef={node => {
                  this.anchorEl = node;
                }}
                aria-owns={openEdit ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={this.handleClickEdit}
              >
                <Edit />
              </IconButton>
              {
                openEdit && (
                  <ClickAwayListener onClickAway={this.handleClickEdit}>
                    <MenuDropdown actions={actions} open={openEdit} anchorElParent={menuDropdownAnchor} />
                  </ClickAwayListener>
                )
              }

            </Grid>
          )}
        </Grid>
      </>
    )
  }
}

export default inject('commonStore', 'organisationStore')(
  observer(
    withStyles(styles)(withProfileManagement(ProfileActions))
  )
);
