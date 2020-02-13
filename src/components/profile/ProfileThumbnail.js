import React from "react";
import {
  withStyles,
  Paper,
  Grid,
  Typography,
  Button,
  Icon
} from "@material-ui/core";
import { get } from 'lodash/fp';

import Logo from "../utils/logo/Logo";
import ProfileService from "../../services/profile.service";
import ProfileContacts from "./ProfileContacts";
import { styles } from "./ProfileThumbnail.css";
import { FormattedMessage } from "react-intl";
import { withProfile } from "../../hoc/profile/withProfile";

const mailOwner = ownerEmail => {
  window.location = `mailto:${ownerEmail}`;
}

const ProfileThumbnail = React.memo(
  withProfile(
    withStyles(styles)(({ classes, record, profileContext, ...props }) => {
      const ownerEmail = get("email.value", profileContext.getProp("owner"));

      return (
        <Paper className={classes.main}>
          <a
            href={
              profileContext.isEditable
                ? profileContext.getBaseUrl() +
                  "/onboard/intro/edit/" +
                  profileContext.getProp("tag")
                : ""
            }
          >
            <Logo
              className={classes.profilePicture}
              src={ProfileService.getPicturePathResized(
                profileContext.getProp("picture"),
                "person",
                "200x200"
              )}
              type="person"
            />
          </a>
          <div className={classes.topOffset}></div>

          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant="h1" className={classes.text}>
                {ProfileService.htmlDecode(profileContext.getProp("name")) ||
                  profileContext.getProp("tag")}
              </Typography>
              <Typography
                variant="h2"
                className={classes.text}
                style={{ marginTop: 16 }}
              >
                {ProfileService.htmlDecode(profileContext.getProp("intro"))}
              </Typography>
            </Grid>

            {ownerEmail && (
              <Grid item container xs={12} direction="row">
                <Grid item xs={12}>
                  <Button color="secondary" variant="contained" fullWidth onClick={() => mailOwner(ownerEmail)}>
                    <Icon className="fa fa-envelope" fontSize="inherit" />
                    <FormattedMessage id={"profile.contactOwner"} />
                  </Button>
                </Grid>
              </Grid>
            )}

            <Grid item container xs={12} direction="row">
              <ProfileContacts />
            </Grid>

            {profileContext.getProp("description") &&
              profileContext.getProp("description") !== "" && (
                <Grid item xs={12}>
                  <Typography variant="h3" className={classes.text}>
                    <FormattedMessage id="profile.aboutMe" />
                  </Typography>
                  <Typography variant="body2" className={classes.description}>
                    {profileContext.getProp("description")}
                  </Typography>
                </Grid>
              )}
          </Grid>
        </Paper>
      );
    })
  )
);

export default ProfileThumbnail;
