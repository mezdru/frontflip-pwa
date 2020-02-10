import React from "react";
import { inject, observer } from "mobx-react";
import { FormattedMessage, injectIntl } from "react-intl";
import undefsafe from "undefsafe";
import _ from "lodash";

import {
  withStyles,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Typography
} from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import AddContactField from "../../utils/fields/AddContact";
import ProfileService from "../../../services/profile.service";
import "../../../resources/stylesheets/font-awesome.min.css";
import LaFourchetteLogo from "../../../resources/images/lafourchette.png";
import DoctolibLogo from "../../../resources/images/doctolib.png";

const Entities = require("html-entities").XmlEntities;
const entities = new Entities();
const styles = {
  link: {
    animation: "linkPop ease 1s",
    animationFillMode: "forwards"
  },
  "@keyframes linkPop": {
    from: { width: 0 },
    to: { width: "100%" }
  },
  defaultLink: {
    width: "100%"
  },
  root: {
    display: "flex",
    zIndex: 1,
    width: "100%",
    padding: 8,
    position: "relative",
    transition: "all 250ms",
    '& div[role="tooltip"]': {
      width: "100%",
      position: "relative!important",
      transform: "translate3d(0px, -60px, 0px)!important"
    }
  },
  iconImg: {
    width: 24,
    height: 24,
    borderRadius: 4
  }
};

class OnboardContacts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      links: [],
      newLinkIndex: null
    };
  }

  componentWillMount() {
    this.setState(
      {
        links: undefsafe(this.props.recordStore.workingRecord, "links") || []
      },
      () => {
        this.setDefaultLinks();
      }
    );
  }

  handleLinksChange = (e, link, index) => {
    let record = this.props.recordStore.workingRecord;
    link.value = e.target.value;
    let links = this.state.links;
    links[index].value = e.target.value;
    record.links = links;
    this.setState({ links });
  };

  deleteLink = linkToRemove => {
    let record = this.props.recordStore.workingRecord;

    record.links = record.links.filter(item => {
      return !(
        item.type === linkToRemove.type && item.value === linkToRemove.value
      );
    });
    this.setState({
      links: this.state.links.filter(
        item =>
          !(
            item.type === linkToRemove.type && item.value === linkToRemove.value
          )
      )
    });
    this.props.handleSave(["links"]);
  };

  addLink = link => {
    let links = this.state.links;
    links.push(link);
    this.setState({ links: links, newLinkIndex: links.length - 1 });
  };

  getLinkByType = typeWanted => {
    let record = this.props.recordStore.workingRecord;
    try {
      return record.links.find(link => link.type === typeWanted);
    } catch (e) {
      return null;
    }
  };

  setTypeInput = type => {
    switch (type) {
      case "email":
        return "email";
      case "phone":
      case "landline":
        return "tel";
      default:
        return "text";
    }
  };

  getTranslatedName = type => {
    return this.props.intl
      .formatMessage({ id: "contact.displayName." + type })
      .replace("&nbsp;", " ");
  };

  setDefaultLinks = () => {
    let types = ["email", "phone", "linkedin"];
    let links = this.state.links;
    for (let type of types) {
      if (!this.getLinkByType(type)) {
        if (links.findIndex(link => link.type === type) === -1) {
          links.push({ type: type, value: "" });
        }
      }
    }
    this.setState({ links });
  };

  getLinkIconComponent = link => {
    switch (link.icon) {
      case "doctolib":
        return (
          <img
            src={DoctolibLogo}
            className={this.props.classes.iconImg}
            alt="Doctolib"
          />
        );
      case "lafourchette":
        return (
          <img
            src={LaFourchetteLogo}
            className={this.props.classes.iconImg}
            alt="La Fourchette"
          />
        );
      default:
        return <i className={"fa fa-" + (link.icon || link.type)} />;
    }
  };

  render() {
    const { links, newLinkIndex } = this.state;
    const { classes } = this.props;

    return (
      <Grid
        container
        style={{
          background: this.props.theme.palette.primary.light,
          padding: 24
        }}
        direction="column"
        alignItems="center"
      >
        <Grid item xs={12} style={{ width: "100%" }}>
          <Typography
            variant="h4"
            style={{
              textAlign: "center",
              padding: 16,
              color: this.props.theme.palette.primary.main
            }}
          >
            <FormattedMessage id={"onboard.yourContact"} />
          </Typography>
          {links &&
            links.map((link, i) => {
              link = _.clone(link);
              ProfileService.makeLinkIcon(link);
              link.value = entities.decode(link.value);
              return (
                <Grid item key={link._id || i} style={{ padding: 8 }}>
                  <TextField
                    className={
                      newLinkIndex && i === newLinkIndex
                        ? classes.link
                        : classes.defaultLink
                    }
                    label={this.getTranslatedName(link.type)}
                    type={this.setTypeInput(link.type)}
                    variant={"outlined"}
                    value={link.value}
                    onChange={e => this.handleLinksChange(e, link, i)}
                    onBlur={() => this.props.handleSave(["links"])}
                    placeholder={this.getTranslatedName(link.type)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          style={{ fontSize: 24 }}
                        >
                          {this.getLinkIconComponent(link)}
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <IconButton
                          position="end"
                          onClick={() => {
                            this.deleteLink(link);
                          }}
                        >
                          <Clear fontSize="default" />
                        </IconButton>
                      )
                    }}
                  />
                </Grid>
              );
            })}
          <Grid container item className={classes.root}>
            <AddContactField onAdd={this.addLink} />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  injectIntl(inject("commonStore", "recordStore")(observer(OnboardContacts)))
);
