import React, { useState } from "react";
import { Grid, Typography, withStyles } from "@material-ui/core";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
  DateTimePicker
} from "@material-ui/pickers";
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
  },
  center: {
    textAlign: "center"
  }
});

function OnboardEventDate({
  classes,
  handleSave,
  getWorkingRecord,
  commonStore,
  intl,
  ...props
}) {
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

        <Grid item className={classes.center}>
          <DateTimePicker
            clearable
            label={intl.formatMessage({
              id: "onboard.date.startDate.placeholder"
            })}
            inputVariant="outlined"
            ampm={false}
            value={startDate}
            onChange={setStartDate}
            minutesStep={5}
            onError={console.log}
            disablePast
            format="lll"
            clearLabel={intl.formatMessage({ id: "onboard.date.clear.label" })}
            cancelLabel={intl.formatMessage({
              id: "onboard.date.cancel.label"
            })}
          />
        </Grid>
        <Grid item className={classes.center}>
          <DateTimePicker
            clearable
            label={intl.formatMessage({
              id: "onboard.date.endDate.placeholder"
            })}
            inputVariant="outlined"
            ampm={false}
            value={endDate}
            onChange={setEndDate}
            minutesStep={5}
            onError={console.log}
            minDate={startDate || new Date()}
            disablePast
            format="lll"
            clearLabel={intl.formatMessage({ id: "onboard.date.clear.label" })}
            cancelLabel={intl.formatMessage({
              id: "onboard.date.cancel.label"
            })}
          />
        </Grid>
      </Grid>
    </MuiPickersUtilsProvider>
  );
}

OnboardEventDate = inject("commonStore")(
  observer(withStyles(styles)(injectIntl(OnboardEventDate)))
);

export default OnboardEventDate;
