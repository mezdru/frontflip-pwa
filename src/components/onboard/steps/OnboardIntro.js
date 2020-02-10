import React from "react";
import { withStyles } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import { TextField, Grid, Typography } from "@material-ui/core";
import PictureField from "../../utils/fields/PictureField";
import { FormattedMessage } from "react-intl";
import { injectIntl } from "react-intl";

const Entities = require("html-entities").XmlEntities;
const entities = new Entities();

const styles = theme => ({
  root: {
    flexBasis: "100%",
    width: "100%",
    minHeight: "100%",
    background: theme.palette.primary.light,
    padding: 24,
    overflow: "auto",
    margin: 0
  },
  field: {
    minWidth: "100% !important"
  }
});

class OnboardIntro extends React.Component {
  render() {
    const { classes } = this.props;
    const { workingRecord } = this.props.recordStore;
    const decodedIntro = entities.decode(workingRecord.intro);
    const decodedName = entities.decode(workingRecord.name);

    return (
      <Grid
        container
        item
        xs={12}
        spacing={2}
        direction="column"
        className={classes.root}
      >
        <Grid item>
          <Typography
            variant="h4"
            style={{
              textAlign: "center",
              color: this.props.theme.palette.primary.dark
            }}
          >
            <FormattedMessage id={"onboard.whoAreYou"} />
          </Typography>
        </Grid>

        <Grid item>
          <PictureField handleSave={this.props.handleSave} pictureType="logo" />
        </Grid>

        <Grid item className={classes.field}>
          <TextField
            label={this.props.intl.formatMessage(
              { id: "onboard.intro.name" },
              { organisationName: this.props.orgStore.currentOrganisation.name }
            )}
            type="text"
            className={classes.field}
            fullWidth
            variant={"outlined"}
            value={decodedName}
            onChange={e =>
              this.props.handleWorkingRecordChange("name", e.target.value)
            }
            onBlur={e => {
              this.props.handleSave(["name"]);
            }}
            error={
              (decodedName && decodedName.length > 64) === true
            }
            helperText={
              decodedName && decodedName.length > 64
                ? "64 characters max"
                : ""
            }
            required
          />
        </Grid>

        <Grid item className={classes.field}>
          <TextField
            label={this.props.intl.formatMessage({ id: "onboard.intro.intro" })}
            type="text"
            className={classes.field}
            fullWidth
            variant={"outlined"}
            value={decodedIntro}
            onChange={e =>
              this.props.handleWorkingRecordChange("intro", e.target.value)
            }
            onBlur={e => this.props.handleSave(["intro"])}
            error={
              (decodedIntro && decodedIntro.length > 256) === true
            }
            helperText={
              decodedIntro && decodedIntro.length > 256
                ? "256 characters max"
                : ""
            }
            required
          />
        </Grid>
      </Grid>
    );
  }
}

export default injectIntl(
  withStyles(styles, { withTheme: true })(
    inject("commonStore", "recordStore", "orgStore")(observer(OnboardIntro))
  )
);
