import React, { useState } from "react";
import { Grid, Typography, withStyles } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import { inject, observer } from "mobx-react";

const styles = theme => ({
  title: {
    textAlign: "center",
    color: theme.palette.primary.main
  },
  root: {
    flexBasis: "100%",
    width: "100%",
    minHeight: "100%",
    background: theme.palette.primary.light,
    padding: 24,
    overflow: "auto",
    margin: 0
  }
});

function OnboardEventDate({ classes, handleSave, getWorkingRecord, commonStore, ...props }) {

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  moment.locale(commonStore.locale);

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
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
            <FormattedMessage id={"onboard.date.title"} />
          </Typography>
        </Grid>

        <Grid item>
          <KeyboardDateTimePicker
            clearable
            label="Date de début"
            inputVariant="outlined"
            ampm={false}
            value={startDate}
            onChange={setStartDate}
            minutesStep={5}
            onError={console.log}
            disablePast
            format="lll"
            clearLabel="vider"
            cancelLabel="annuler"
          />
        </Grid>
        <Grid item>
          <KeyboardDateTimePicker
            clearable
            label="Date de fin"
            inputVariant="outlined"
            ampm={false}
            value={endDate}
            onChange={setEndDate}
            minutesStep={5}
            onError={console.log}
            minDate={startDate || new Date()}
            disablePast
            format="lll"
            clearLabel="vider"
            cancelLabel="annuler"
          />
        </Grid>
      </Grid>
    </MuiPickersUtilsProvider>
  );
}

OnboardEventDate = inject("commonStore")(observer(withStyles(styles)(OnboardEventDate)));

export default OnboardEventDate;
