import React from "react";
import {
  Grid,
  withStyles,
  Typography,
  IconButton,
  CardActions,
  CardContent,
  CardHeader,
  Card,
  Tooltip
} from "@material-ui/core";
import withWidth from "@material-ui/core/withWidth";
import { inject, observer } from "mobx-react";
import { Link } from "react-router-dom";
import Wings from "../utils/wing/Wings";
import defaultPicture from "../../resources/images/placeholder_person.png";
import ProfileService from "../../services/profile.service";
import { styles } from "./CardProfile.css";
import { injectIntl } from "react-intl";
import { getBaseUrl, getProgressiveImage } from "../../services/utils.service";
import undefsafe from "undefsafe";
// import '../../resources/stylesheets/font-awesome.min.css';
React.lazy(() => import("../../resources/stylesheets/font-awesome.min.css"));

ProfileService.setExtraLinkLimit(5);
const WINGS_DISPLAYED = 7;

class CardProfile extends React.Component {
  componentDidMount() {
    this.props.recordStore.addRecord({
      provider: "algolia",
      ...this.props.hit
    });
  }

  getLogoSize = () => {
    switch (this.props.width) {
      case "xs":
        return "150x150";
      default:
        return "200x200";
    }
  };

  getClaps(hit, hashtagId) {
    var clapEntry = {};
    if (!hit || !hit.hashtags_claps) return null;
    clapEntry = Object.assign(
      clapEntry,
      hit.hashtags_claps.find(elt => elt.hashtag === hashtagId)
    );
    return clapEntry ? clapEntry.claps : null;
  }

  isHidden = tag => {
    return this.props.commonStore.hiddenWings.find(
      hiddenWing => hiddenWing.tag === tag
    );
  };

  handleContactClick = link => {
    this.props.keenStore.recordEvent("contact", {
      type: link.type,
      value: link.value,
      recordEmitter: undefsafe(this.props.recordStore.currentUserRecord, "_id"),
      recordTarget: this.props.hit.objectID
    });
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      JSON.stringify(nextProps.hit) !== JSON.stringify(this.props.hit) ||
      (!nextProps.light && this.props.light)
    )
      return true;

    return false;
  }

  render() {
    const { classes, hit, light } = this.props;
    const { locale } = this.props.commonStore;
    let currentWings = 0;

    ProfileService.transformLinks(hit);
    ProfileService.makeHightlighted(hit);
    ProfileService.orderHashtags(hit);

    return (
      <Card className={classes.fullWidth} key={hit.objectID}>
        <Grid item container>
          <Link
            to={getBaseUrl(this.props) + "/" + hit.tag}
            style={{ width: "100%", textDecoration: "none" }}
          >
            <CardHeader
              avatar={
                <Grid item container>
                  <Grid
                    item
                    style={{
                      backgroundImage: light
                        ? ""
                        : `url(${getProgressiveImage(
                            ProfileService.getPicturePathResized(
                              hit.picture,
                              "person ",
                              this.getLogoSize()
                            )
                          ) || defaultPicture})`
                    }}
                    className={`${classes.logo} ${classes.backgroundLogo}`}
                  />
                </Grid>
              }
              title={
                <Typography
                  variant="h1"
                  className={`${classes.name} ${classes.titleSmallestView}`}
                  gutterBottom
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html:
                        ProfileService.htmlDecode(
                          (hit._highlightResult && hit._highlightResult.name
                            ? hit._highlightResult.name.value
                            : null) || hit.name
                        ) || hit.tag
                    }}
                  ></span>
                </Typography>
              }
              subheader={
                <Typography
                  variant="h2"
                  className={`${classes.name} ${classes.intro}`}
                  gutterBottom
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: ProfileService.htmlDecode(
                        (hit._snippetResult && hit._snippetResult.intro
                          ? hit._snippetResult.intro.value
                          : null) ||
                          hit.intro ||
                          ""
                      )
                    }}
                  ></span>
                </Typography>
              }
              className={classes.cardHeader}
            />
          </Link>
        </Grid>
        <Grid item container className={classes.contactField}>
          <CardActions disableActionSpacing>
            <Grid item container>
              {!light && hit.links &&
                hit.links.map((link, i) => {
                  if (!link.value || link.value === "") return null;
                  if (link.type === "workchat") return null; // hide workchat
                  if (link.class !== "extraLink") {
                    return (
                      <Grid
                        item
                        key={link._id}
                        className={classes.contact}
                        onClick={() => this.handleContactClick(link)}
                      >
                        <Tooltip
                          title={
                            ProfileService.htmlDecode(link.display) ||
                            ProfileService.htmlDecode(link.value) ||
                            ProfileService.htmlDecode(link.url)
                          }
                        >
                          <IconButton
                            href={link.url}
                            rel="noopener"
                            target="_blank"
                            className={
                              classes.contactButton + " fa fa-" + link.icon
                            }
                          />
                        </Tooltip>
                      </Grid>
                    );
                  } else {
                    return null;
                  }
                })}
            </Grid>
          </CardActions>
        </Grid>
        <Grid container item className={classes.wingsContainer}>
          <CardContent style={{ paddingBottom: 0 }}>
            <Grid container className={classes.wings}>
              {!light && hit.hashtags &&
                hit.hashtags.map((hashtag, i) => {
                  if (
                    currentWings >= WINGS_DISPLAYED ||
                    this.isHidden(hashtag.tag)
                  )
                    return null;
                  currentWings++;
                  let displayedName = ProfileService.getWingDisplayedName(
                    hashtag,
                    locale
                  );
                  let claps = this.getClaps(hit, hashtag._id);
                  return (
                    <Wings
                      src={ProfileService.getPicturePath(hashtag.picture)}
                      key={hashtag._id}
                      label={ProfileService.htmlDecode(displayedName)}
                      onClick={e =>
                        this.props.searchStore.addFilter(
                          "hashtags.tag",
                          hashtag.tag
                        )
                      }
                      recordId={hit.objectID}
                      hashtagId={hashtag._id}
                      claps={claps}
                      mode={hashtag.class ? "highlight" : "card"}
                      enableClap={true}
                    />
                  );
                })}
              {!light && hit.hashtags && hit.hashtags.length > WINGS_DISPLAYED && (
                <Link to={getBaseUrl(this.props) + "/" + hit.tag}>
                  <Wings
                    label={this.props.intl.formatMessage(
                      { id: "card.moreWings" },
                      { counter: hit.hashtags.length - WINGS_DISPLAYED }
                    )}
                    enableClap={false}
                    mode="card"
                  />
                </Link>
              )}
            </Grid>
          </CardContent>
        </Grid>
      </Card>
    );
  }
}

export default inject(
  "commonStore",
  "orgStore",
  "recordStore",
  "keenStore",
  "searchStore"
)(observer(withWidth()(withStyles(styles)(injectIntl(CardProfile)))));
