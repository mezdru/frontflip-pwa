import React from "react";
import {
  withStyles,
  ListItem,
  List,
  CircularProgress
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import Logo from "../logo/Logo";
import { Link } from "react-router-dom";
import undefsafe from "undefsafe";
import defaultLogo from "../../../resources/images/wingzy_512.png";

const Entities = require("html-entities").XmlEntities;
const entities = new Entities();

const style = theme => ({
  orgItem: {
    position: "relative",
    display: "inline-block",
    width: "33.33%",
    textAlign: "center",
    padding: 8
  },
  orgsContainer: {
    position: "relative",
    width: "100%",
    listStyleType: "none",
    textAlign: "left"
  },
  itemLogo: {
    position: "relative",
    left: 0,
    right: 0,
    margin: "auto",
    border: "2px solid white"
  },
  itemName: {
    textTransform: "uppercase",
    fontSize: "0.675rem",
    fontWeight: "600",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    marginTop: 8,
    color: "white"
  },
  circularProgressContainer: {
    position: "relative",
    width: "100%",
    textAlign: "center"
  }
});

class OrganisationsList extends React.Component {
  state = {
    items: []
  };

  componentDidMount() {
    let currentUserOrganisations = this.props.orgStore.organisations.filter(
      org =>
        this.props.userStore.currentUser.orgsAndRecords.find(
          oar => (oar.organisation._id || oar.organisation) === org._id
        )
    );

    let currentUserSecondaryRecords = undefsafe(
      this.props.userStore.currentOrgAndRecord,
      "secondaryRecords"
    );

    if (this.props.dataType === "record") {
      this.setState({ items: this.buildItems(currentUserSecondaryRecords) });
    } else {
      this.setState({ items: this.buildItems(currentUserOrganisations) });
    }
  }

  /**
   * @returns Array of item : {name, _id, pictureUrl, redirectLink, redirectComponent}
   */
  buildItems = data => {
    if (!data || data.length === 0) return;
    const { dataType } = this.props;
    const { locale } = this.props.commonStore;
    const { currentOrganisation } = this.props.orgStore;
    let arrayOfItems = [];

    data.forEach(elt => {
      if (
        (dataType === "organisation" && elt.tag !== currentOrganisation.tag) ||
        dataType === "record"
      ) {
        arrayOfItems.push({
          name: elt.name,
          _id: elt._id,
          pictureUrl:
            dataType === "record"
              ? undefsafe(elt, "picture.url")
              : undefsafe(elt, "logo.url"),
          redirectLink: `/${locale}/${
            dataType === "record"
              ? currentOrganisation.tag + "/" + elt.tag
              : elt.tag
          }`,
          redirectComponent: dataType === "record" ? Link : "a"
        });
      }
    });
    return arrayOfItems;
  };

  render() {
    const { classes } = this.props;
    const { items } = this.state;

    return (
      <List className={classes.orgsContainer}>
        {items.map((item, i) => {
          return (
            <ListItem
              button
              component={item.redirectComponent}
              href={item.redirectLink}
              to={item.redirectLink}
              key={item._id}
              className={classes.orgItem}
              onClick={this.props.onClick}
            >
              <Logo
                type={"smallOrg"}
                alt={entities.decode(item.name)}
                src={item.pictureUrl || defaultLogo}
                className={classes.itemLogo}
              />
              <div className={classes.itemName}>
                {entities.decode(item.name)}
              </div>
            </ListItem>
          );
        })}
        {items.length === 0 && (
          <div className={classes.circularProgressContainer}>
            <CircularProgress />
          </div>
        )}
      </List>
    );
  }
}

export default inject(
  "orgStore",
  "commonStore",
  "userStore"
)(observer(withStyles(style, { withTheme: true })(OrganisationsList)));
