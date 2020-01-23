import React from "react";
import moment from "moment";
import { inject, observer } from "mobx-react";
import { AccessTime } from "@material-ui/icons";
import { withStyles, Tooltip, Grid } from "@material-ui/core";

const styles = theme => ({
  icon: {
    color: "rgba(255,255,255,.7)",
    marginRight: 0,
    textAlign: 'left'
  },
  text: {
    color: "rgba(255,255,255,.7)"
  },
  root: {
    maxWidth: "calc(100% - 23px)",
    [theme.breakpoints.down("xs")]: {
      maxWidth: "calc(100% - 23px)"
    }
  }
});

function EventDate({ commonStore, startDate, endDate, classes, ...props }) {
  moment.locale(commonStore.locale);

  let getTooltip = () => {
    let out;
    if (startDate) out = moment(startDate).calendar();
    if (out && endDate) out += " - " + moment(endDate).calendar();
    else if (endDate) out = moment(endDate).calendar();
    return out;
  };

  if (!endDate && !startDate) return null;

  if (new Date().getTime() < endDate) {
    return (
      <div className={classes.root}>
        <Tooltip title={getTooltip()}>
          <Grid container>
            <Grid item xs={2} className={classes.icon}>
              <AccessTime  />
            </Grid>
            <Grid item xs={10} className={classes.text}>
              {new Date().getTime() < startDate ? (
                <>commence le {moment(startDate).calendar()}</>
              ) : (
                <>se termine le {moment(endDate).calendar()}</>
              )}
            </Grid>
          </Grid>
        </Tooltip>
      </div>
    );
  } else return null;
}

EventDate = inject("commonStore")(observer(withStyles(styles)(EventDate)));

export default React.memo(EventDate);
