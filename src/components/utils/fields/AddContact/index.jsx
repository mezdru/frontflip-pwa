import React, { useState } from "react";
import {
  withStyles,
  Grid,
  Fab,
  Popper,
  Grow,
  Paper,
  ClickAwayListener
} from "@material-ui/core";
import PropTypes from "prop-types";
import { Add } from "@material-ui/icons";
import "../../../profile/ContactsColors.css";
import contacts from "../../../../resources/data/contacts.json";
import { styles } from "./design";
import { FormattedHTMLMessage, injectIntl } from "react-intl";
import LaFourchetteLogo from "../../../../resources/images/lafourchette.png";
import DoctolibLogo from "../../../../resources/images/doctolib.png";
import { inject, observer } from "mobx-react";
import { pipe, keys, filter, isEmpty, get } from "lodash/fp";

let AddContact = ({ classes, onAdd, intl, orgStore, ...props }) => {
  const [open, setOpen] = useState(false);
  let anchorEl;

  const defaultLinks = pipe(
    keys,
    filter(contact => !contacts[contact].optional)
  )(contacts);

  const availableLinks = pipe(
    get("settings.onboard.links"),
    orgLinks => isEmpty(orgLinks) ? defaultLinks : orgLinks
  )(orgStore.currentOrganisation);

  const stringToImage = str => {
    switch (str) {
      case "doctolib":
        return DoctolibLogo;
      case "lafourchette":
        return LaFourchetteLogo;
      default:
        return null;
    }
  };

  const addContact = typeOfField => {
    onAdd({ type: typeOfField, value: "" });
    setOpen(false);
  };

  return (
    <Grid container item direction={"column"} alignItems={"center"}>
      <Fab
        className={classes.addButton}
        buttonRef={node => {
          anchorEl = node;
        }}
        aria-owns={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={() => setOpen(true)}
      >
        <Add fontSize="large" color="secondary" />
      </Fab>
      <Popper open={open} anchorEl={anchorEl} transition disablePortal>
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            id="menu-list-grow"
            style={{ marginTop: -250 }}
          >
            <Paper className={classes.paper}>
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <Grid container justify={"center"} alignItems={"center"}>
                  {availableLinks.map((contactType, index) => {
                    const workingContact = contacts[contactType];

                    return (
                      <Grid
                        item
                        key={index}
                        className={classes.contactItem}
                        onClick={() => addContact(contactType)}
                      >
                        {workingContact.iconType === "classe" ? (
                          <i
                            className={
                              classes.contactIcon + " " + workingContact.icon
                            }
                          />
                        ) : (
                          <img
                            src={stringToImage(contactType)}
                            className={classes.contactImg}
                            alt="Link icon"
                          />
                        )}
                        <span className={classes.contactName}>
                          <FormattedHTMLMessage
                            id={"contact.displayName." + contactType}
                          />
                        </span>
                      </Grid>
                    );
                  })}
                </Grid>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Grid>
  );
};

AddContact.propTypes = {
  onAdd: PropTypes.func
};

AddContact = inject("orgStore")(
  observer(injectIntl(withStyles(styles)(AddContact)))
);

export default React.memo(AddContact);
