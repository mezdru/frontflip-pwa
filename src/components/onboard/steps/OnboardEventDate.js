import React, { useState } from "react";
import { Grid, Typography, withStyles } from "@material-ui/core";
import { FormattedMessage, injectIntl } from "react-intl";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
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
  commonStore,
  recordStore,
  intl,
  ...props
}) {
  const record = recordStore.workingRecord;

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleChange = (date, field) => {
    let dateObject = moment(date).toDate();
    record[field] = dateObject;
    if (field === "startDate") setStartDate(dateObject);
    else setEndDate(dateObject);
  };

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
            value={record.startDate || null}
            onChange={e => handleChange(e, "startDate")}
            onBlur={() => {
              handleSave(["startDate"]);
            }}
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
            value={record.endDate || null}
            onChange={e => handleChange(e, "endDate")}
            onBlur={() => {
              handleSave(["endDate"]);
            }}
            minutesStep={5}
            onError={console.log}
            minDate={record.startDate || new Date()}
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

OnboardEventDate = withStyles(styles)(
  injectIntl(inject("commonStore", "recordStore")(observer(OnboardEventDate)))
);

export default OnboardEventDate;
