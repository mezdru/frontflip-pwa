import React from "react";
import { Grid, withStyles, Tooltip, IconButton } from "@material-ui/core";
import LaFourchetteLogo from "../../../resources/images/lafourchette.png";
import DoctolibLogo from "../../../resources/images/doctolib.png";
import profileService from "../../../services/profile.service";

const styles = theme => ({
  contactContainer: {
    height: 40,
    overflow: "hidden"
  },
  contact: {
    [theme.breakpoints.up("xs")]: {
      margin: 2
    }
  },
  contactButton: {
    width: 36,
    height: 36,
    fontSize: "20px !important",
    opacity: 0.5,
    "&::before": {
      position: "absolute",
      left: 0,
      right: 0,
      margin: "auto"
    },
    "&:hover": {
      backgroundColor: "#41424F",
      opacity: 1
    }
  },
  contactImage: {
    width: 22,
    height: 22,
    borderRadius: 4
  }
});

function ContactsList({ classes, contacts, handleContactClick, ...props }) {
  return (
    <Grid
      item
      container
      className={`${classes.contactContainer} ${props.className}`}
    >
      {contacts &&
        contacts.map((link, i) => {
          if (!link.value || link.value === "") return null;
          if (link.type === "workchat") return null; // hide workchat
          if (link.class !== "extraLink") {
            return (
              <Grid
                item
                key={link._id || i}
                className={classes.contact}
                onClick={() => handleContactClick(link)}
              >
                <Tooltip
                  title={
                    profileService.htmlDecode(link.display) ||
                    profileService.htmlDecode(link.value) ||
                    profileService.htmlDecode(link.url)
                  }
                >
                  <IconButton
                    href={link.url}
                    rel="noopener"
                    target="_blank"
                    className={classes.contactButton + " fa fa-" + link.icon}
                  >
                    {link.type === "doctolib" && (
                      <img
                        src={DoctolibLogo}
                        className={classes.contactImage}
                        alt="Doctolib"
                      />
                    )}
                    {link.type === "lafourchette" && (
                      <img
                        src={LaFourchetteLogo}
                        className={classes.contactImage}
                        alt="La Fourchette"
                      />
                    )}
                  </IconButton>
                </Tooltip>
              </Grid>
            );
          } else {
            return null;
          }
        })}
    </Grid>
  );
}

ContactsList = withStyles(styles)(ContactsList);

export default ContactsList;
