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
import { Add } from "@material-ui/icons";

const Entities = require("html-entities").XmlEntities;
const entities = new Entities();

const style = theme => ({
  orgItem: {
    position: "relative",
    display: "inline-block",
    width: "33.33%",
    height: 80,
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
  },
  itemButton: {
    top: 0,
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "white",
    position: "relative",
    opacity: 0.7,
    transition: "opacity 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    left: 0,
    right: 0,
    margin: "auto",
    "&:hover": {
      opacity: 1
    },
    "& > svg": {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      left: 0,
      right: 0,
      margin: "auto"
    }
  }
});

class OrganisationsList extends React.Component {
  state = {
    items: [],
    loadInProgress: true
  };

  componentDidMount() {
    this.setState({
      items: this.buildItems(this.props.data),
      loadInProgress: false
    });
  }

  /**
   * @returns Array of item : {name, _id, pictureUrl, redirectLink, redirectComponent}
   */
  buildItems = data => {
    const { dataType } = this.props;
    const { locale } = this.props.commonStore;
    const { currentOrganisation } = this.props.orgStore;
    let arrayOfItems = [];

    if (data && data.length !== 0) {
      data.forEach(elt => {
        if (
          (dataType === "organisation" &&
            elt.tag !== undefsafe(currentOrganisation, "tag")) ||
          dataType === "person" ||
          dataType === "event"
        ) {
          arrayOfItems.push({
            name: elt.name,
            _id: elt._id,
            pictureUrl:
              dataType === "organisation"
                ? undefsafe(elt, "logo.url")
                : undefsafe(elt, "picture.url"),
            redirectLink: `/${locale}/${
              dataType === "organisation"
                ? elt.tag
                : currentOrganisation.tag + "/" + elt.tag
            }`,
            redirectComponent: dataType === "organisation" ? "a" : Link
          });
        }
      });
    }

    if (dataType === "person" || dataType === "event") {
      arrayOfItems.push({
        name: null,
        _id: "a1",
        addButton: true,
        redirectLink: `/${locale}/${
          currentOrganisation.tag
        }/onboard/intro/create/${
          dataType === "person" ? "@NewProfile" : "@NewEvent"
        }`,
        redirectComponent: Link
      });
    }
    return arrayOfItems;
  };

  render() {
    const { classes } = this.props;
    const { items, loadInProgress } = this.state;

    return (
      <List className={classes.orgsContainer}>
        {items &&
          items.length > 0 &&
          items.map((item, i) => {
            return (
              <ListItem
                button
                component={item.redirectComponent}
                href={item.redirectLink}
                to={item.redirectLink}
                push
                key={item._id}
                className={classes.orgItem}
                onClick={this.props.onClick}
              >
                {item.addButton ? (
                  <div className={classes.itemButton}>
                    <Add fontSize="medium" color="secondary" />
                  </div>
                ) : (
                  <Logo
                    type={"smallOrg"}
                    alt={entities.decode(item.name)}
                    src={item.pictureUrl || defaultLogo}
                    className={classes.itemLogo}
                  />
                )}
                <div className={classes.itemName}>
                  {entities.decode(item.name)}
                </div>
              </ListItem>
            );
          })}
        {loadInProgress && (
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
