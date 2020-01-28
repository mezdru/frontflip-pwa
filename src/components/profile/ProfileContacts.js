import React from "react";
import { withStyles, IconButton, Grid, Tooltip } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import classNames from "classnames";
import "../../resources/stylesheets/font-awesome.min.css";
import { withProfile } from "../../hoc/profile/withProfile";
import ProfileService from "../../services/profile.service";
import undefsafe from "undefsafe";
import LaFourchetteLogo from '../../resources/images/lafourchette.png';
import DoctolibLogo from '../../resources/images/doctolib.png';

const styles = theme => ({
  contactIcon: {
    marginRight: 8,
    position: "relative",
    textAlign: "center",
    width: 48,
    fontSize: "32px !important",
    display: "inline-block"
  },
  contactImage: {
    width: 32,
    height: 32,
    borderRadius: 4
  }
});

const ProfileContacts = React.memo(
  inject(
    "keenStore",
    "recordStore"
  )(
    observer(
      withProfile(
        withStyles(styles)(({ classes, profileContext, ...props }) => {
          var contacts = profileContext.getProp("links");
          return (
            <>
              {contacts &&
                contacts.length > 0 &&
                contacts.map((contact, index) => {
                  if (!contact.value || contact.value === "") return null;
                  if (contact.type === "workchat") return null; // hide workchat
                  return (
                    <Grid
                      item
                      key={contact._id}
                      style={{ position: "relative" }}
                      onClick={e =>
                        props.keenStore.recordEvent("contact", {
                          type: contact.type,
                          value: contact.value,
                          recordEmitter: undefsafe(
                            props.recordStore.currentUserRecord,
                            "_id"
                          ),
                          recordTarget: profileContext.getProp("_id")
                        })
                      }
                    >
                      <Tooltip
                        title={
                          ProfileService.htmlDecode(contact.display) ||
                          ProfileService.htmlDecode(contact.value) ||
                          ProfileService.htmlDecode(contact.url)
                        }
                      >
                        <IconButton
                          href={contact.url}
                          rel="noopener"
                          target="_blank"
                          className={classNames(
                            classes.contactIcon,
                            "fa fa-" + contact.icon
                          )}
                        >
                          {contact.type === 'doctolib' && (
                            <img src={DoctolibLogo} className={classes.contactImage} alt="Doctolib"/>
                          )}
                          {contact.type === 'lafourchette' && (
                            <img src={LaFourchetteLogo} className={classes.contactImage} alt="La Fourchette" />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  );
                })}
            </>
          );
        })
      )
    )
  )
);

export default ProfileContacts;
