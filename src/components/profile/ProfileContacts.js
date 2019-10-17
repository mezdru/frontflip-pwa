import React from 'react';
import { withStyles, IconButton, Grid, Tooltip } from '@material-ui/core';
import classNames from 'classnames';
import '../../resources/stylesheets/font-awesome.min.css';
import './ContactsColors.css';
import { withProfileManagement } from '../../hoc/profile/withProfileManagement';
import ProfileService from '../../services/profile.service';

const styles = theme => ({
  contactIcon: {
    marginRight: 8,
    position: 'relative',
    textAlign: 'center',
    width: 48,
    fontSize: '32px !important',
    display: 'inline-block',
  },
});

const ProfileContacts = React.memo(withProfileManagement(withStyles(styles)(({ classes, profileContext, ...props }) => {
  var contacts = profileContext.getProp('links');
  return (
    <>
      {contacts && contacts.length > 0 && contacts.map((contact, index) => {
        if (!contact.value || contact.value === '') return null;
        if (contact.type === 'workchat') return null; // hide workchat
        return (
          <Grid item key={contact._id} style={{ position: 'relative' }}>
            <Tooltip title={ProfileService.htmlDecode(contact.display) || ProfileService.htmlDecode(contact.value) || ProfileService.htmlDecode(contact.url)}>
              <IconButton href={contact.url} rel="noopener" target="_blank" className={classNames(classes.contactIcon, "fa fa-" + contact.icon)} />
            </Tooltip>
          </Grid>
        )
      })}
    </>
  );
})));

export default ProfileContacts;