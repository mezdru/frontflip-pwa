import React from "react";
import { withStyles } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import { TextField, Grid, Typography } from "@material-ui/core";
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
    minWidth: "100% !important",
    minHeight: 250
  }
});

class OnboardDescription extends React.Component {
  render() {
    const { classes } = this.props;
    let record = this.props.recordStore.workingRecord;
    const decodedDescription = entities.decode(record.description);

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
            <FormattedMessage id={"onboard.description.title"} />
          </Typography>
        </Grid>

        <Grid item className={classes.field}>
          <TextField
            label={this.props.intl.formatMessage({
              id: "onboard.description.label"
            })}
            type="text"
            className={classes.field}
            fullWidth
            rowsMax={20}
            rows={10}
            multiline
            variant={"outlined"}
            value={decodedDescription}
            onChange={e =>
              this.props.handleWorkingRecordChange(
                "description",
                e.target.value
              )
            }
            onBlur={e => {
              this.props.handleSave(["description"]);
            }}
            error={
              (decodedDescription && decodedDescription.length > 1200) === true
            }
            helperText={
              decodedDescription && decodedDescription.length > 1200
                ? "1200 characters max"
                : ""
            }
          />
        </Grid>
      </Grid>
    );
  }
}

export default injectIntl(
  withStyles(styles, { withTheme: true })(
    inject(
      "commonStore",
      "recordStore",
      "orgStore"
    )(observer(OnboardDescription))
  )
);
