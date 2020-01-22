import React from "react";
import { withStyles, Grid, IconButton, Tooltip } from "@material-ui/core";
import { ArrowBack, Edit, Delete } from "@material-ui/icons";
import classNames from "classnames";
import { inject, observer } from "mobx-react";
import { withProfile } from "../../hoc/profile/withProfile";
import { getBaseUrl } from "../../services/utils.service.js";
import { Link } from "react-router-dom";
import { injectIntl } from "react-intl";
import urlService from "../../services/url.service";

const styles = theme => ({
  button: {
    height: 40,
    width: 40
  },
  returnButton: {
    marginLeft: 16,
    background: "white",
    color: theme.palette.secondary.main,
    opacity: 0.7,
    transition: "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      backgroundColor: "white",
      color: theme.palette.secondary.main,
      opacity: 1
    }
  }
});

class ProfileActions extends React.PureComponent {
  handleDelete = () => {
    if (
      window.confirm(
        this.props.intl.formatMessage({ id: "profile.actions.delete.confirm" })
      )
    ) {

      let isMyProfile =
        this.props.recordStore.currentUserRecord._id ===
        this.props.profileContext.getProp("_id");

      this.props.recordStore
        .deleteRecord(this.props.profileContext.getProp("_id"))
        .then(() => {
          if (isMyProfile) {
            this.props.authStore.logout();
            window.location.href = urlService.createUrl(
              window.location.host,
              "/signin",
              null
            );
          } else {
            window.location.href = urlService.createUrl(
              window.location.host,
              "/" + this.props.orgStore.currentOrganisation.tag,
              null
            );
          }
        })
        .catch(e => {
          console.error(e);
          window.alert(
            this.props.intl.formatMessage({
              id: "profile.actions.delete.error"
            })
          );
        });
    }
  };

  render() {
    const { classes } = this.props;
    const { isEditable } = this.props.profileContext;
    return (
      <>
        <Grid item xs={2}>
          <IconButton
            className={classNames(classes.button, classes.returnButton)}
            onClick={this.props.handleClose}
          >
            <ArrowBack />
          </IconButton>
        </Grid>

        <Grid container item justify="flex-end" alignContent="flex-end" xs={10}>
          {isEditable && (
            <Grid item>
              <Tooltip
                placement="left"
                title={this.props.intl.formatMessage({
                  id: "profile.actions.delete"
                })}
              >
                <IconButton
                  onClick={this.handleDelete}
                  className={classNames(classes.button, classes.returnButton)}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </Grid>
          )}

          {isEditable && (
            <Grid item>
              <IconButton
                className={classNames(classes.button, classes.returnButton)}
                component={Link}
                to={
                  getBaseUrl(this.props) +
                  "/onboard/intro/edit/" +
                  this.props.profileContext.getProp("tag")
                }
              >
                <Edit />
              </IconButton>
            </Grid>
          )}
        </Grid>
      </>
    );
  }
}

export default inject(
  "commonStore",
  "orgStore",
  "recordStore",
  "authStore"
)(
  observer(
    withStyles(styles)(withProfile(injectIntl(ProfileActions)))
  )
);
