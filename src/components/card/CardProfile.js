import React, { Suspense } from "react";
import { withStyles, Typography } from "@material-ui/core";
import withWidth from "@material-ui/core/withWidth";
import { inject, observer } from "mobx-react";
import { Link } from "react-router-dom";
import defaultPicture from "../../resources/images/placeholder_person.png";
import ProfileService from "../../services/profile.service";
import { styles } from "./CardProfile.css";
import { injectIntl } from "react-intl";
import { getBaseUrl, getProgressiveImage } from "../../services/utils.service";
import undefsafe from "undefsafe";

React.lazy(() => import("../../resources/stylesheets/font-awesome.min.css"));
const EventDate = React.lazy(() => import("./EventDate"));
const Wings = React.lazy(() => import("../utils/wing/Wings"));
const ContactsList = React.lazy(() =>
  import("../utils/itemsList/ContactsList")
);

ProfileService.setExtraLinkLimit(5);
const WINGS_DISPLAYED = 6;

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
        return "190x190";
      default:
        return "240x240";
    }
  };

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

  getLogoUrl = record => {
    return `${getProgressiveImage(
      ProfileService.getPicturePathResized(
        record.picture,
        "person ",
        this.getLogoSize()
      )
    ) || defaultPicture}`;
  };

  smoothImageLoad = record => {
    if (!record) return;
    var img = document.createElement("img");
    img.src = this.getLogoUrl(record);
    img.onload = () => {
      let imgFilter = document.getElementById(
        "card-logo-filter-" + (record.objectID || record._id)
      );
      if (!imgFilter) return;
      imgFilter.style.opacity = 0;
    };
  };

  render() {
    const { classes, hit, light } = this.props;
    const { locale } = this.props.commonStore;
    let currentWings = 0;

    ProfileService.transformLinks(hit);
    ProfileService.makeHightlighted(hit);
    ProfileService.orderHashtags(hit);

    this.smoothImageLoad(hit);
    if(window.performance.memory) {
      let m = window.performance.memory;
      console.log( (m.usedJSHeapSize / m.totalJSHeapSize)*100  + ' %');
    }

    return (
      <Link
        to={getBaseUrl(this.props) + "/" + hit.tag}
        className={classes.noLinkStyle}
      >
        <div className={classes.root}>
          <div
            className={classes.logo}
            style={{ backgroundImage: `url(${this.getLogoUrl(hit)})` }}
          >
            <div
              id={"card-logo-filter-" + (hit.objectID || hit._id)}
              className={classes.logoFilter}
            ></div>
          </div>
          <div className={classes.dataContainer}>
            <Typography variant="h1" className={classes.text}>
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
            <Typography
              variant="h2"
              className={`${classes.text} ${classes.ellipsis}`}
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
            {hit.type === "person" ? (
              <Suspense fallback={<></>}>
                <ContactsList
                  className={classes.contactsContainer}
                  handleContactClick={this.handleContactClick}
                  contacts={hit.links}
                />
              </Suspense>
            ) : (
              <Suspense fallback={<></>}>
                <EventDate startDate={hit.startDate} endDate={hit.endDate} />
              </Suspense>
            )}
          </div>
          <div className={classes.wingsContainer}>
            {hit.hashtags &&
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
                return (
                  <Suspense fallback={<></>} key={hashtag._id}>
                    <Wings
                      src={
                        !light
                          ? ProfileService.getPicturePath(hashtag.picture)
                          : null
                      }
                      label={ProfileService.htmlDecode(displayedName)}
                      onClick={e =>
                        this.props.searchStore.addFilter(
                          "hashtags.tag",
                          hashtag.tag
                        )
                      }
                      recordId={hit.objectID}
                      hashtagId={hashtag._id}
                      mode={hashtag.class ? "highlight" : "card"}
                    />
                  </Suspense>
                );
              })}
            {hit.hashtags && hit.hashtags.length > WINGS_DISPLAYED && (
              <Link to={getBaseUrl(this.props) + "/" + hit.tag}>
                <Suspense fallback={<></>}>
                  <Wings
                    label={this.props.intl.formatMessage(
                      { id: "card.moreWings" },
                      { counter: hit.hashtags.length - WINGS_DISPLAYED }
                    )}
                    enableClap={false}
                    mode="card"
                  />
                </Suspense>
              </Link>
            )}
          </div>
        </div>
      </Link>
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
