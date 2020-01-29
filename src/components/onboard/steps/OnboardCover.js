import React from "react";
import { Grid, Typography, withStyles } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import PictureField from "../../utils/fields/PictureField";

const styles = theme => ({
  title: {
    textAlign: "center",
    color: theme.palette.primary.main,
  },
  root: {
    flexBasis: '100%',
    width: '100%',
    minHeight: '100%',
    background: theme.palette.primary.light,
    padding: 24,
    overflow: 'auto',
    margin: 0,

  }
});

function OnboardCover({ classes, handleSave, getWorkingRecord, ...props }) {
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
        <Typography variant="h4" className={classes.title}>
          <FormattedMessage id={"onboard.cover.title"} />
        </Typography>
      </Grid>

      <Grid item>
        <PictureField getWorkingRecord={getWorkingRecord} pictureType="cover" handleSave={handleSave} />
      </Grid>
    </Grid>
  );
}

OnboardCover = withStyles(styles)(OnboardCover);
export default OnboardCover;
