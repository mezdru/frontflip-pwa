import React from "react";
import { withStyles } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import { Grid, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { injectIntl } from "react-intl";
import GeocodingField from "../../utils/fields/GeocodingField";

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

class OnboardGeo extends React.Component {
  handleChange = (_geoloc, location) => {
    let record = this.props.recordStore.workingRecord;
    record["_geoloc"] = _geoloc;
    record["location"] = location;
    console.log(JSON.parse(JSON.stringify(record)))
  };

  render() {
    const { classes } = this.props;

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
            <FormattedMessage id={"onboard.geo.title"} />
          </Typography>
        </Grid>

        <Grid item className={classes.field}>
          <GeocodingField
            onChange={this.handleChange}
            handleSave={e => this.props.handleSave(["_geoloc", "location"])}
          />
        </Grid>
      </Grid>
    );
  }
}

export default injectIntl(
  withStyles(styles, { withTheme: true })(
    inject("commonStore", "recordStore", "orgStore")(observer(OnboardGeo))
  )
);
